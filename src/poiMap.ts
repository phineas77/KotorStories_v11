/** Map zones for the 29-chapter manual walking guide.
 * One marker represents a geographical area, not one chapter or GPS trigger.
 * Previously used demo coordinates and OSM coordinates are reference anchors.
 * These are navigation aids, not a turn-by-turn walking route; field-verify before release.
 */
export type TourZone = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  accuracy: 'existing-demo' | 'osm-feature' | 'approximate-area';
};
export const tourZones: TourZone[] = [
  {id:'Morska vrata',label:'Sea Gate',latitude:42.4248,longitude:18.7714,accuracy:'existing-demo'},
  {id:'Trg od oružja',label:'Square of Arms',latitude:42.42497,longitude:18.77184,accuracy:'existing-demo'},
  {id:'Katedrala Sv. Tripuna',label:'St Tryphon Cathedral',latitude:42.4241,longitude:18.7719,accuracy:'existing-demo'},
  {id:'Pomorski muzej',label:'Maritime Museum',latitude:42.42465,longitude:18.77243,accuracy:'existing-demo'},
  {id:'Trg Sv. Luke',label:'St Luke Square',latitude:42.42528,longitude:18.77265,accuracy:'existing-demo'},
  {id:'Sjeverna vrata i Škurda',label:'River / North Gate',latitude:42.42625,longitude:18.77216,accuracy:'osm-feature'},
  {id:'Kotorske zidine',label:'City Walls · Karampana',latitude:42.42513,longitude:18.77122,accuracy:'osm-feature'},
  {id:'Južni dio Starog grada',label:'Flour Square / Palaces',latitude:42.42425,longitude:18.77222,accuracy:'approximate-area'},
  {id:'Završetak ture',label:'South Gate / Tour End',latitude:42.42227,longitude:18.77174,accuracy:'osm-feature'},
];
