"""Experimental, single-sample Montenegrin TTS using AiDA Parla and SNAC.

Keeps the existing Qwen and Turkish TTS installations untouched.
Based on the model author's audio token decoding example; not tested against GPU here.
"""
from pathlib import Path
import argparse


def decode_snac_tokens(seq, codec, torch):
    # AiDA emits seven interleaved SNAC codebook tokens per time step.
    seq = [int(x) - 128266 for x in seq]
    seq = seq[: (len(seq) // 7) * 7]
    if not seq:
        raise RuntimeError("Model did not produce a complete SNAC audio frame.")
    a, b, c = [], [], []
    for p in range(0, len(seq), 7):
        t = seq[p:p + 7]
        vals = (t[0], t[1] - 4096, t[2] - 8192,
                t[3] - 12288, t[4] - 16384,
                t[5] - 20480, t[6] - 24576)
        if any(v < 0 or v >= 4096 for v in vals):
            raise RuntimeError(f"Invalid SNAC token group at index {p // 7}: {vals}")
        a.append(vals[0])
        b.extend((vals[1], vals[4]))
        c.extend((vals[2], vals[3], vals[5], vals[6]))
    codes = [torch.tensor([a], dtype=torch.long),
             torch.tensor([b], dtype=torch.long),
             torch.tensor([c], dtype=torch.long)]
    with torch.inference_mode():
        return codec.decode(codes).squeeze().cpu().numpy()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--speaker", default="alek", help="AiDA model speaker (e.g. alek, arsa, janko, bora, zoki)")
    ap.add_argument("--text-file", type=Path, default=Path(__file__).with_name("prva_naracija_probe.txt"))
    ap.add_argument("--output", type=Path, default=Path("local_qwen_audio/me/aida/01-me-TEST.wav"))
    ap.add_argument("--max-new-tokens", type=int, default=2300)
    args = ap.parse_args()

    text = args.text_file.read_text(encoding="utf-8").strip()
    if not text:
        raise ValueError("Sample is empty")
    import torch
    import soundfile as sf
    from snac import SNAC
    from unsloth import FastLanguageModel

    print("Loading AiDA Parla in 4-bit mode (experimental, requires adequate GPU memory)...", flush=True)
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name="datatab/aida-parla-16bit-v1",
        max_seq_length=4096,
        dtype=None,
        load_in_4bit=True,
    )
    FastLanguageModel.for_inference(model)
    full_prompt = f"{args.speaker}: {text}"
    content_ids = tokenizer(full_prompt, return_tensors="pt").input_ids
    bos = torch.tensor([[128259]], dtype=torch.int64)
    eos_prompt = torch.tensor([[128009, 128260]], dtype=torch.int64)
    input_ids = torch.cat([bos, content_ids, eos_prompt], dim=1).to("cuda")
    attention_mask = torch.ones_like(input_ids)

    print("Synthesizing short Montenegrin test...", flush=True)
    with torch.inference_mode():
        result = model.generate(
            input_ids=input_ids,
            attention_mask=attention_mask,
            max_new_tokens=args.max_new_tokens,
            do_sample=True,
            temperature=0.2,
            top_p=0.95,
            repetition_penalty=1.6,
            num_return_sequences=1,
            eos_token_id=128258,
            use_cache=True,
            pad_token_id=tokenizer.eos_token_id,
        )
    row = result[0]
    starts = (row == 128257).nonzero(as_tuple=True)[0]
    if starts.numel() == 0:
        raise RuntimeError("AiDA did not return the audio-start token (128257). Try a shorter text.")
    stream = row[int(starts[-1]) + 1:].tolist()
    if 128258 in stream:
        stream = stream[:stream.index(128258)]
    print("Decoding audio tokens with SNAC...", flush=True)
    del model
    torch.cuda.empty_cache()
    codec = SNAC.from_pretrained("hubertsiuzdak/snac_24khz").eval().cpu()
    audio = decode_snac_tokens(stream, codec, torch)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(args.output), audio, 24000)
    print(f"Saved: {args.output.resolve()}")


if __name__ == "__main__":
    main()
