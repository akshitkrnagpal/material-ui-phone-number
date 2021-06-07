// Country model:
// [
//    Country name,
//    Regions,
//    iso2 code,
//    International dial code,
//    Format (if available),
//    Order (if >1 country with same dial code),
//    Area codes (if >1 country with same dial code)
// ]
//
// Regions:
// ['america', 'europe', 'asia', 'oceania', 'africa']
//
// Sub-regions:
// ['north-america', 'south-america', 'central-america', 'carribean',
//  'european-union', 'ex-ussr', 'middle-east', 'north-africa']

const rawAllCountries = [
  [
    'Belgium',
    ['europe', 'european-union'],
    'be',
    '32',
    '+.. ... .. .. ..',
  ],
  [
    'France',
    ['europe', 'european-union'],
    'fr',
    '33',
    '+.. . .. .. .. ..',
  ],
  [
    'Germany',
    ['europe', 'european-union'],
    'de',
    '49',
    '+.. .... ........',
  ],
  [
    'Italy',
    ['europe', 'european-union'],
    'it',
    '39',
    '+.. ... .......',
    0,
  ],
  [
    'Netherlands',
    ['europe', 'european-union'],
    'nl',
    '31',
    '+.. .. ........',
  ],
  [
    'United Kingdom',
    ['europe', 'european-union'],
    'gb',
    '44',
    '+.. .... ......',
  ],
];

const allCountryCodes = {};

function addCountryCode(iso2, dialCode, priority) {
  if (!(dialCode in allCountryCodes)) {
    allCountryCodes[dialCode] = [];
  }
  const index = priority || 0;
  allCountryCodes[dialCode][index] = iso2;
}

const allCountries = [].concat(...rawAllCountries.map((country) => {
  const [name, regions, iso2, dialCode, format, priority, areaCodes] = country;

  const countryItem = {
    name,
    regions,
    iso2,
    dialCode,
    priority,
    format: format || undefined,
    hasAreaCodes: areaCodes,
  };

  const areaItems = [];

  if (countryItem.hasAreaCodes) {
    areaCodes.forEach((areaCode) => {
      const areaItem = {
        ...countryItem,
        regions,
        dialCode: `${dialCode}${areaCode}`,
        isAreaCode: true,
      };

      areaItems.push(areaItem);

      addCountryCode(iso2, areaItem.dialCode);
    });
  }

  addCountryCode(
    countryItem.iso2,
    countryItem.dialCode,
    countryItem.hasAreaCodes,
  );

  return (areaItems.length > 0) ? [countryItem, ...areaItems] : [countryItem];
}));

module.exports = {
  allCountries,
  allCountryCodes,
};
