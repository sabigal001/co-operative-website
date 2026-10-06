// Nigerian States and Local Government Areas (LGAs) for dynamic selection

export interface StateLgaMap {
  [state: string]: string[];
}

export const NIGERIA_STATES_LGAS: StateLgaMap = {
  Lagos: [
    'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 
    'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 
    'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 
    'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'
  ],
  Ogun: [
    'Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Ewekoro', 'Ifo', 
    'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 'Ikenne', 
    'Imeko Afon', 'Ipokia', 'Obafemi Owode', 'Odeda', 'Odogbolu', 
    'Ogun Waterside', 'Remo North', 'Sagamu', 'Yewa North', 'Yewa South'
  ],
  Oyo: [
    'Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 
    'Ibadan North', 'Ibadan North-East', 'Ibadan North-West', 'Ibadan South-East', 'Ibadan South-West', 
    'Ibarapa Central', 'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 
    'Iseyin', 'Itesiwaju', 'Iwajowa', 'Ogbomosho North', 'Ogbomosho South', 
    'Olorunsogo', 'Oluyole', 'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East', 'Saki West'
  ],
  'FCT Abuja': [
    'Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council (AMAC)'
  ],
  Rivers: [
    'Port Harcourt', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Oyigbo', 
    'Okrika', 'Ogu-Bolo', 'Bonny', 'Degema', 'Asari-Toru', 
    'Akuku-Toru', 'Ahoada East', 'Ahoada West', 'Emohua', 'Etche'
  ],
  Kano: [
    'Kano Municipal', 'Dala', 'Fagge', 'Gwale', 'Nassarawa', 
    'Tarauni', 'Ungogo', 'Kumbotso', 'Dawakin Kudu', 'Gezawa', 'Minjibir'
  ],
  Kaduna: [
    'Kaduna North', 'Kaduna South', 'Chikun', 'Igabi', 'Zaria', 
    'Sabon Gari', 'Kudan', 'Makarfi', 'Soba', 'Jema\'a'
  ],
  Anambra: [
    'Awka North', 'Awka South', 'Onitsha North', 'Onitsha South', 'Idemili North', 
    'Idemili South', 'Nnewi North', 'Nnewi South', 'Aguata', 'Ogbaru'
  ],
  Enugu: [
    'Enugu East', 'Enugu North', 'Enugu South', 'Nkanu East', 'Nkanu West', 
    'Nsukka', 'Udi', 'Ezeagu', 'Oji River', 'Igbo-Eze North'
  ],
  Delta: [
    'Warri South', 'Warri North', 'Warri South West', 'Uvwie', 'Sapele', 
    'Ughelli North', 'Ughelli South', 'Oshimili South (Asaba)', 'Oshimili North', 'Ika North East'
  ],
  Edo: [
    'Oredo (Benin City)', 'Ikpoba Okha', 'Egor', 'Ovia North-East', 'Ovia South-West', 
    'Esan Central', 'Esan North-East', 'Esan West', 'Etsako West', 'Akoko-Edo'
  ],
  Osun: [
    'Osogbo', 'Olorunda', 'Ilesa East', 'Ilesa West', 'Ife Central', 
    'Ife East', 'Ife North', 'Ife South', 'Ede North', 'Ede South', 'Ejigbo'
  ],
  Ondo: [
    'Akure South', 'Akure North', 'Ondo West', 'Ondo East', 'Owo', 
    'Idanre', 'Okitipupa', 'Ilaje', 'Ese Odo', 'Akoko North-East'
  ],
  Kwara: [
    'Ilorin West', 'Ilorin East', 'Ilorin South', 'Asa', 'Moro', 'Offa', 'Ifelodun', 'Edu'
  ],
  Plateau: [
    'Jos North', 'Jos South', 'Jos East', 'Barkin Ladi', 'Riyom', 'Mangu', 'Pankshin'
  ],
  AkwaIbom: [
    'Uyo', 'Ikot Ekpene', 'Eket', 'Oron', 'Abak', 'Etinan', 'Ibesikpo Asutan'
  ],
  CrossRiver: [
    'Calabar Municipal', 'Calabar South', 'Akpabuyo', 'Odukpani', 'Ikom', 'Ogoja'
  ],
  Imo: [
    'Owerri Municipal', 'Owerri North', 'Owerri West', 'Mbaitoli', 'Ikeduru', 'Orlu'
  ],
  Abia: [
    'Aba North', 'Aba South', 'Umuahia North', 'Umuahia South', 'Osisioma', 'Obingwa'
  ],
  Benue: [
    'Makurdi', 'Gboko', 'Otukpo', 'Gwer East', 'Gwer West', 'Katsina-Ala'
  ],
  Kogi: [
    'Lokoja', 'Okene', 'Adavi', 'Ajaokuta', 'Kabba/Bunu', 'Ankpa', 'Idah'
  ],
  Nasarawa: [
    'Lafia', 'Keffi', 'Karu', 'Akwanga', 'Doma', 'Nasarawa'
  ],
  Niger: [
    'Chanchaga (Minna)', 'Bosso', 'Suleja', 'Bida', 'Kontagora', 'Mokwa'
  ],
  Bauchi: [
    'Bauchi', 'Katagum', 'Misau', 'Jama\'are', 'Tafawa Balewa', 'Dass'
  ],
  Sokoto: [
    'Sokoto North', 'Sokoto South', 'Wamakko', 'Kware', 'Bodinga', 'Gwadabawa'
  ],
  Borno: [
    'Maiduguri', 'Jere', 'Biu', 'Bama', 'Konduga', 'Gwoza'
  ],
  Gombe: [
    'Gombe', 'Akko', 'Yamaltu/Deba', 'Kaltungo', 'Billiri'
  ],
  Yobe: [
    'Damaturu', 'Potiskum', 'Gashua', 'Nguru', 'Geidam'
  ],
  Taraba: [
    'Jalingo', 'Wukari', 'Takum', 'Bali', 'Gashaka', 'Sardauna'
  ],
  Adamawa: [
    'Yola North', 'Yola South', 'Mubi North', 'Mubi South', 'Girei', 'Numan'
  ],
  Kebbi: [
    'Birnin Kebbi', 'Argungu', 'Yauri', 'Zuru', 'Jega'
  ],
  Zamfara: [
    'Gusau', 'Kaura Namoda', 'Talata Mafara', 'Anka', 'Maru'
  ],
  Jigawa: [
    'Dutse', 'Hadejia', 'Kazaure', 'Gumel', 'Ringim'
  ],
  Katsina: [
    'Katsina', 'Daura', 'Funtua', 'Malumfashi', 'Kankia'
  ],
  Ekiti: [
    'Ado-Ekiti', 'Ikere', 'Ijero', 'Oye', 'Ido-Osi', 'Ekiti West'
  ],
  Ebonyi: [
    'Abakaliki', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Ezza North'
  ],
  Bayelsa: [
    'Yenagoa', 'Brass', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw'
  ]
};

export const ALL_NIGERIAN_STATES = Object.keys(NIGERIA_STATES_LGAS).sort();

export function getLgasForState(state: string): string[] {
  return NIGERIA_STATES_LGAS[state] || ['Central', 'North', 'South', 'East', 'West'];
}
