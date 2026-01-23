import axios from "axios";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const currencies: Currency[] = [
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "AFN", name: "Afghan Afghani", symbol: "؋", flag: "🇦🇫" },
  { code: "ALL", name: "Albanian Lek", symbol: "L", flag: "🇦🇱" },
  { code: "AMD", name: "Armenian Dram", symbol: "֏", flag: "🇦🇲" },
  { code: "ANG", name: "Netherlands Antillian Guilder", symbol: "ƒ", flag: "🇨🇼" },
  { code: "AOA", name: "Angolan Kwanza", symbol: "Kz", flag: "🇦🇴" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", flag: "🇦🇷" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "AWG", name: "Aruban Florin", symbol: "ƒ", flag: "🇦🇼" },
  { code: "AZN", name: "Azerbaijani Manat", symbol: "₼", flag: "🇦🇿" },
  { code: "BAM", name: "Bosnia and Herzegovina Mark", symbol: "KM", flag: "🇧🇦" },
  { code: "BBD", name: "Barbados Dollar", symbol: "$", flag: "🇧🇧" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", flag: "🇧🇬" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "ب.د", flag: "🇧🇭" },
  { code: "BIF", name: "Burundian Franc", symbol: "FBu", flag: "🇧🇮" },
  { code: "BMD", name: "Bermudian Dollar", symbol: "$", flag: "🇧🇲" },
  { code: "BND", name: "Brunei Dollar", symbol: "$", flag: "🇧🇳" },
  { code: "BOB", name: "Bolivian Boliviano", symbol: "Bs.", flag: "🇧🇴" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "BSD", name: "Bahamian Dollar", symbol: "$", flag: "🇧🇸" },
  { code: "BTN", name: "Bhutanese Ngultrum", symbol: "Nu.", flag: "🇧🇹" },
  { code: "BWP", name: "Botswana Pula", symbol: "P", flag: "🇧🇼" },
  { code: "BYN", name: "Belarusian Ruble", symbol: "Br", flag: "🇧🇾" },
  { code: "BZD", name: "Belize Dollar", symbol: "$", flag: "🇧🇿" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CDF", name: "Congolese Franc", symbol: "FC", flag: "🇨🇩" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CLF", name: "Chilean Unidad de Fomento", symbol: "UF", flag: "🇨🇱" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", flag: "🇨🇱" },
  { code: "CNH", name: "Offshore Chinese Renminbi", symbol: "¥", flag: "🇨🇳" },
  { code: "CNY", name: "Chinese Renminbi", symbol: "¥", flag: "🇨🇳" },
  { code: "COP", name: "Colombian Peso", symbol: "$", flag: "🇨🇴" },
  { code: "CRC", name: "Costa Rican Colon", symbol: "₡", flag: "🇨🇷" },
  { code: "CUP", name: "Cuban Peso", symbol: "$", flag: "🇨🇺" },
  { code: "CVE", name: "Cape Verdean Escudo", symbol: "Esc", flag: "🇨🇻" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },
  { code: "DJF", name: "Djiboutian Franc", symbol: "Fdj", flag: "🇩🇯" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  { code: "DOP", name: "Dominican Peso", symbol: "RD$", flag: "🇩🇴" },
  { code: "DZD", name: "Algerian Dinar", symbol: "دج", flag: "🇩🇿" },
  { code: "EGP", name: "Egyptian Pound", symbol: "ج.م", flag: "🇪🇬" },
  { code: "ERN", name: "Eritrean Nakfa", symbol: "Nfk", flag: "🇪🇷" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", flag: "🇪🇹" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "FJD", name: "Fiji Dollar", symbol: "$", flag: "🇫🇯" },
  { code: "FKP", name: "Falkland Islands Pound", symbol: "£", flag: "🇫🇰" },
  { code: "FOK", name: "Faroese Króna", symbol: "kr", flag: "🇫🇴" },
  { code: "GBP", name: "Pound Sterling", symbol: "£", flag: "🇬🇧" },
  { code: "GEL", name: "Georgian Lari", symbol: "₾", flag: "🇬🇪" },
  { code: "GGP", name: "Guernsey Pound", symbol: "£", flag: "🇬🇬" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭" },
  { code: "GIP", name: "Gibraltar Pound", symbol: "£", flag: "🇬🇮" },
  { code: "GMD", name: "Gambian Dalasi", symbol: "D", flag: "🇬🇲" },
  { code: "GNF", name: "Guinean Franc", symbol: "FG", flag: "🇬🇳" },
  { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q", flag: "🇬🇹" },
  { code: "GYD", name: "Guyanese Dollar", symbol: "$", flag: "🇬🇾" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "HNL", name: "Honduran Lempira", symbol: "L", flag: "🇭🇳" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn", flag: "🇭🇷" },
  { code: "HTG", name: "Haitian Gourde", symbol: "G", flag: "🇭🇹" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪", flag: "🇮🇱" },
  { code: "IMP", name: "Manx Pound", symbol: "£", flag: "🇮🇲" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "IQD", name: "Iraqi Dinar", symbol: "ع.د", flag: "🇮🇶" },
  { code: "IRR", name: "Iranian Rial", symbol: "﷼", flag: "🇮🇷" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr", flag: "🇮🇸" },
  { code: "JEP", name: "Jersey Pound", symbol: "£", flag: "🇯🇪" },
  { code: "JMD", name: "Jamaican Dollar", symbol: "$", flag: "🇯🇲" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا", flag: "🇯🇴" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "KES", name: "Kenyan Shilling", symbol: "Sh", flag: "🇰🇪" },
  { code: "KGS", name: "Kyrgyzstani Som", symbol: "сом", flag: "🇰🇬" },
  { code: "KHR", name: "Cambodian Riel", symbol: "៛", flag: "🇰🇭" },
  { code: "KID", name: "Kiribati Dollar", symbol: "$", flag: "🇰🇮" },
  { code: "KMF", name: "Comorian Franc", symbol: "CF", flag: "🇰🇲" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼" },
  { code: "KYD", name: "Cayman Islands Dollar", symbol: "$", flag: "🇰🇾" },
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸", flag: "🇰🇿" },
  { code: "LAK", name: "Lao Kip", symbol: "₭", flag: "🇱🇦" },
  { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل", flag: "🇱🇧" },
  { code: "LKR", name: "Sri Lanka Rupee", symbol: "Rs", flag: "🇱🇰" },
  { code: "LRD", name: "Liberian Dollar", symbol: "$", flag: "🇱🇷" },
  { code: "LSL", name: "Lesotho Loti", symbol: "L", flag: "🇱🇸" },
  { code: "LYD", name: "Libyan Dinar", symbol: "ل.د", flag: "🇱🇾" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م", flag: "🇲🇦" },
  { code: "MDL", name: "Moldovan Leu", symbol: "L", flag: "🇲🇩" },
  { code: "MGA", name: "Malagasy Ariary", symbol: "Ar", flag: "🇲🇬" },
  { code: "MKD", name: "Macedonian Denar", symbol: "ден", flag: "🇲🇰" },
  { code: "MMK", name: "Burmese Kyat", symbol: "Ks", flag: "🇲🇲" },
  { code: "MNT", name: "Mongolian Tögrög", symbol: "₮", flag: "🇲🇳" },
  { code: "MOP", name: "Macanese Pataca", symbol: "P", flag: "🇲🇴" },
  { code: "MRU", name: "Mauritanian Ouguiya", symbol: "UM", flag: "🇲🇷" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "₨", flag: "🇲🇺" },
  { code: "MVR", name: "Maldivian Rufiyaa", symbol: "ރ.", flag: "🇲🇻" },
  { code: "MWK", name: "Malawian Kwacha", symbol: "MK", flag: "🇲🇼" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  { code: "MZN", name: "Mozambican Metical", symbol: "MT", flag: "🇲🇿" },
  { code: "NAD", name: "Namibian Dollar", symbol: "$", flag: "🇳🇦" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "NIO", name: "Nicaraguan Córdoba", symbol: "C$", flag: "🇳🇮" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨", flag: "🇳🇵" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", flag: "🇴🇲" },
  { code: "PAB", name: "Panamanian Balboa", symbol: "B/.", flag: "🇵🇦" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/.", flag: "🇵🇪" },
  { code: "PGK", name: "Papua New Guinean Kina", symbol: "K", flag: "🇵🇬" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł", flag: "🇵🇱" },
  { code: "PYG", name: "Paraguayan Guaraní", symbol: "₲", flag: "🇵🇾" },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", flag: "🇶🇦" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", flag: "🇷🇴" },
  { code: "RSD", name: "Serbian Dinar", symbol: "дин", flag: "🇷🇸" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
  { code: "RWF", name: "Rwandan Franc", symbol: "RF", flag: "🇷🇼" },
  { code: "SAR", name: "Saudi Riyal", symbol: "ر.س", flag: "🇸🇦" },
  { code: "SBD", name: "Solomon Islands Dollar", symbol: "$", flag: "🇸🇧" },
  { code: "SCR", name: "Seychellois Rupee", symbol: "₨", flag: "🇸🇨" },
  { code: "SDG", name: "Sudanese Pound", symbol: "ج.س", flag: "🇸🇩" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "SHP", name: "Saint Helena Pound", symbol: "£", flag: "🇸🇭" },
  { code: "SLE", name: "Sierra Leonean Leone", symbol: "Le", flag: "🇸🇱" },
  { code: "SOS", name: "Somali Shilling", symbol: "Sh", flag: "🇸🇴" },
  { code: "SRD", name: "Surinamese Dollar", symbol: "$", flag: "🇸🇷" },
  { code: "SSP", name: "South Sudanese Pound", symbol: "£", flag: "🇸🇸" },
  { code: "STN", name: "São Tomé and Príncipe Dobra", symbol: "Db", flag: "🇸🇹" },
  { code: "SYP", name: "Syrian Pound", symbol: "ل.س", flag: "🇸🇾" },
  { code: "SZL", name: "Eswatini Lilangeni", symbol: "E", flag: "🇸🇿" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "TJS", name: "Tajikistani Somoni", symbol: "ЅМ", flag: "🇹🇯" },
  { code: "TMT", name: "Turkmenistan Manat", symbol: "m", flag: "🇹🇲" },
  { code: "TND", name: "Tunisian Dinar", symbol: "د.ت", flag: "🇹🇳" },
  { code: "TOP", name: "Tongan Paʻanga", symbol: "T$", flag: "🇹🇴" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "TTD", name: "Trinidad and Tobago Dollar", symbol: "TT$", flag: "🇹🇹" },
  { code: "TVD", name: "Tuvaluan Dollar", symbol: "$", flag: "🇹🇻" },
  { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$", flag: "🇹🇼" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "Sh", flag: "🇹🇿" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", flag: "🇺🇦" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "Sh", flag: "🇺🇬" },
  { code: "USD", name: "United States Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$U", flag: "🇺🇾" },
  { code: "UZS", name: "Uzbekistani So'm", symbol: "so'm", flag: "🇺🇿" },
  { code: "VES", name: "Venezuelan Bolívar Soberano", symbol: "Bs.", flag: "🇻🇪" },
  { code: "VND", name: "Vietnamese Đồng", symbol: "₫", flag: "🇻🇳" },
  { code: "VUV", name: "Vanuatu Vatu", symbol: "Vt", flag: "🇻🇺" },
  { code: "WST", name: "Samoan Tālā", symbol: "T", flag: "🇼🇸" },
  { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA", flag: "🇨🇲" },
  { code: "XCD", name: "East Caribbean Dollar", symbol: "$", flag: "🇦🇬" },
  { code: "XDR", name: "Special Drawing Rights", symbol: "SDR", flag: "🌐" },
  { code: "XOF", name: "West African CFA franc", symbol: "CFA", flag: "🇨🇮" },
  { code: "XPF", name: "CFP Franc", symbol: "₣", flag: "🇵🇫" },
  { code: "YER", name: "Yemeni Rial", symbol: "﷼", flag: "🇾🇪" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", flag: "🇿🇲" },
  { code: "ZWL", name: "Zimbabwean Dollar", symbol: "Z$", flag: "🇿🇼" },
];

export interface ConversionResult {
  conversion_rate: number;
  conversion_result: number;
}

export const convertCurrency = async (
  from: string,
  to: string,
  amount: number
): Promise<ConversionResult> => {
  if (from === to) {
    return {
      conversion_rate: 1,
      conversion_result: amount
    };
  }

  const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
  const apiUrl = import.meta.env.VITE_EXCHANGE_API_URL;
  const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';
  
  // Use mock API if enabled
  const baseUrl = useMock ? 'http://localhost:3001' : apiUrl;
  const url = `${baseUrl}/pair/${from}/${to}/${amount}`;

  const headers = useMock ? {} : {
    Authorization: `Bearer ${apiKey}`,
  };

  const response = await axios.get(url, { headers });
  
  const conversion: ConversionResult = {
    conversion_rate: response.data?.conversion_rate,
    conversion_result: response.data?.conversion_result
  };
  
  return conversion;
};
