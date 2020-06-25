'use strict';
/**
 * Function return ISO format for diffrent date
 * At first determine type for date string by regex
 * Then call function which return array components of date
 * And call function which return ISO format
 * @param {Object} obj with list of dates and key
 */
function source_d (obj) {
  const parser = {
    /**
     * Array of object with RegExp and Parse function
     * @returns {Object<RegExp, Function>} Object with RegExp and Function return components of date
     */
    regexes: [
      {
        regex: /([\d]{4})(-|.)([\d]{2})(-|.)([\d]{2})T?(([\d]{2}):([\d]{2}):([\d]{2})).?([\d]{3})?(Z|[+-][\d]{2}:[\d]{2})?/ig,
        parse: items => [items[1], items[3], items[5], items[7], items[8], items[9], items[10], items[11]]
      },
      {
        regex: /([\d]{2})(?:|-|\.)([\d]{2})(?:|-|\.)([\d]{4})\s*года\s*([\d]{2})*:*([\d]{2})*/ig,
        parse: items => [items[3], items[2], items[1], items[4], items[5]]
      },
      {
        regex: /([\d]{4})(-|.)([\d]{2})(-|.)([\d]{2})\sгода\s*в?\s?([\d]{2})?:?([\d]{2})?\s?\(?\s?п?о?\s?([\w\W]*?\s)?/ig,
        parse: items => {
          let gmt;
          // Optional if need parse type zone. For test is not need.
          const timerZoner = {
            'местному': 'Z',
            'московскому': 'Z'
          };
          if (items[8]) {
            gmt = timerZoner[items[8].trim()];
          }
          return [items[1], items[3], items[5], items[6], items[7], undefined, undefined, gmt];
        }
      },
      {
        regex: /([\d]{4})(-|.)([\d]{2})(-|.)([\d]{2})(Z|[+-][\d]{2}:[\d]{2})?/ig,
        parse: items => [items[1], items[3], items[5], undefined, undefined, undefined, undefined, items[6]]
      },
      {
        regex: /"?«?([\d]{1,2})"?»?\s([\w\W]+?)\s([\d]{4})/ig,
        parse: items => {
          const monthes = [
            { 'template': 'янв', 'value': '01' },
            { 'template': 'фев', 'value': '02' },
            { 'template': 'мар', 'value': '03' },
            { 'template': 'ма', 'value': '05' },
            { 'template': 'апр', 'value': '04' },
            { 'template': 'июн', 'value': '06' },
            { 'template': 'июл', 'value': '07' },
            { 'template': 'авг', 'value': '08' },
            { 'template': 'сен', 'value': '09' },
            { 'template': 'окт', 'value': '10' },
            { 'template': 'ноя', 'value': '11' },
            { 'template': 'дек', 'value': '12' }
          ];

          const month = monthes.find(x => items[2].includes(x.template))['value'];

          let day = items[1] || '';
          if (day.length === 1) {
            day = `0${day}`;
          }
          return [items[3], month, day, undefined, undefined, undefined, undefined, items[6]];
        }
      },
      {
        regex: /([\d]{2})\/([\d]{2})\/([\d]{4})[\w\W]+?в\s([\d]{2}):([\d]{2})\s?\(?\s?п?о?\s?([\w\W]*?\s)?/ig,
        parse: (items) => [items[3], items[2], items[1], items[4], undefined, items[5]]
      }
    ],
    /**
     * Function return ISO format by components of date
     * @param year year || '1970'
     * @param month month || '01'
     * @param day day || '01'
     * @param hour hour || '00'
     * @param minutes minutes || '00'
     * @param second second || '00'
     * @param ms milliseconds || '000'
     * @param gmt Greenwich Mean Time || 'Z'
     * @returns {string} ISO date
     */
    toISO: ([year = '1970', month = '01', day = '01', hour = '00', minutes = '00', second = '00', ms = '000', gmt = 'Z']) =>
      `${year}-${month}-${day}T${hour}:${minutes}:${second}.${ms}${gmt}`
  };
  for (const x of parser.regexes) {
    let items = x.regex.exec(obj.src[obj.options]);
    if (items) {
      return parser.toISO(x.parse(items));
    }
  }
  console.error("Don't find template for date");
  return null;
};

module.exports = source_d;
