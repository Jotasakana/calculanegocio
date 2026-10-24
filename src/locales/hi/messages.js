// हिन्दी में नतीजों और त्रुटियों के संदेश। हर कुंजी सभी भाषाओं में होनी चाहिए (scripts/check-i18n.mjs जाँचता है)।
// मानों में {मार्कर} हो सकते हैं और बहुवचन के लिए { one, other, ... } वाला ऑब्जेक्ट।
// "iva" और "precio" आंतरिक नाम कर से जुड़े दो कैलकुलेटरों के लिए रखे गए हैं, पर हिन्दी में ये सामान्य (जेनेरिक) हैं:
// कर का प्रतिशत उपयोगकर्ता लिखता है और किसी देश के नियम नहीं माने जाते।

export const errors = {
  'invalid-number': 'हर खाने में सही संख्या लिखें।',
  negative: 'रक़म और प्रतिशत ऋणात्मक (माइनस) नहीं हो सकते।',
  'percent-over-100': 'प्रतिशत जाँचें: वे 100% से ज़्यादा नहीं हो सकते।',
  'quantity-positive': 'मात्रा शून्य से ज़्यादा होनी चाहिए।',
  'quantities-positive': 'मात्राएँ धनात्मक होनी चाहिए।',
  'margin-under-100': 'मार्जिन 100% से कम होना चाहिए।',
  'margin-plus-commission': 'मार्जिन और कमीशन का जोड़ 100% या उससे ज़्यादा है: ऐसा मूल्य संभव नहीं।',
  'discount-under-100': 'छूट 100% से कम होनी चाहिए।',
  'returns-over-sales': 'वापसी बिक्री से ज़्यादा नहीं हो सकती।',
};

export const messages = {
  'common.notComputable': 'गणना संभव नहीं',
  'common.checkData': 'अपने आँकड़े जाँचें।',
  'common.assumption.noVat': 'सभी व्यावसायिक रक़में कर से पहले निकाली जाती हैं।',

  'margen.label.margin': 'बिक्री पर मार्जिन',
  'margen.label.price': 'कर से पहले बिक्री मूल्य',
  'margen.label.cost': 'सुझाई गई अधिकतम लागत',
  'margen.note': 'बिक्री पर मार्जिन और लागत पर मार्कअप अलग-अलग प्रतिशत हैं।',
  'margen.note.below': 'ध्यान दें: बिक्री मूल्य लागत से कम है।',
  'margen.line.benefit': 'प्रति इकाई मुनाफ़ा',
  'margen.line.margin': 'बिक्री पर मार्जिन',
  'margen.line.markup': 'लागत पर मार्कअप',
  'margen.bar.cost': 'लागत',
  'margen.bar.profit': 'मुनाफ़ा',
  'margen.line.total': { one: 'कुल मुनाफ़ा ({units} इकाई)', other: 'कुल मुनाफ़ा ({units} इकाइयाँ)' },

  'precio.label': 'कर समेत बिक्री मूल्य',
  'precio.note': 'कर से पहले का मूल्य: {price}',
  'precio.line.totalCost': 'कुल लागत',
  'precio.line.fee': 'कमीशन',
  'precio.line.profit': 'प्रति इकाई मुनाफ़ा',
  'precio.line.margin': 'असली मार्जिन',
  'precio.line.markup': 'असली मार्कअप',
  'precio.line.vat': 'कर',
  'precio.line.listNet': 'छूट से पहले का सूची मूल्य (कर से पहले)',
  'precio.line.listGross': 'छूट से पहले का सूची मूल्य (कर समेत)',
  'precio.bar.cost': 'लागत',
  'precio.bar.fee': 'कमीशन',
  'precio.bar.profit': 'मुनाफ़ा',
  'precio.bar.vat': 'कर',
  'precio.assumption': 'कमीशन कर से पहले के मूल्य पर निकाला जाता है। कर अलग दिखाया जाता है और मुनाफ़े का हिस्सा नहीं है। कर की दर वही प्रतिशत है जो आप लिखते हैं; यह टूल किसी देश के नियम नहीं जानता।',

  'rentabilidad.label': 'अवधि का शुद्ध नतीजा',
  'rentabilidad.note': 'शुद्ध मार्जिन: {rate}',
  'rentabilidad.line.revenue': 'शुद्ध आय',
  'rentabilidad.line.gross': 'सकल लाभ',
  'rentabilidad.line.operating': 'परिचालन नतीजा',
  'rentabilidad.line.pretax': 'कर से पहले',
  'rentabilidad.line.net': 'शुद्ध मार्जिन',
  'rentabilidad.bar.cogs': 'बिक्री की लागत',
  'rentabilidad.bar.operating': 'परिचालन ख़र्च',
  'rentabilidad.bar.other': 'वित्तीय ख़र्च और कर',
  'rentabilidad.bar.net': 'शुद्ध नतीजा',
  'rentabilidad.assumption': 'दिखाया गया कर आपकी हाथ से डाली गई रक़म है; हम देय कर का अनुमान नहीं लगाते। कर की रक़म के बिना अंतिम नतीजा कर से पहले का होता है।',

  'iva.label': 'कर समेत कुल',
  'iva.note': 'कर की रक़म: {vat}',
  'iva.line.base': 'कर आधार (कर से पहले की रक़म)',
  'iva.line.vat': 'कर',
  'iva.line.groupBase': '{rate}% पर आधार',
  'iva.line.groupVat': '{rate}% पर कर',
  'iva.bar.base': 'कर आधार',
  'iva.bar.vat': 'कर',
  'iva.assumption': 'आपके लिखे प्रतिशत से निकाला गया मोटा अनुमान। रक़म को मुद्रा की सबसे छोटी इकाई तक राउंड किया जाता है और कुल, आधार और कर का जोड़ होता है। कई लाइनों में हर दर का आधार जोड़कर कर निकाला जाता है। इनवॉइस जारी करने से पहले अपने लिए लागू दर और गणना का तरीक़ा जाँच लें।',
};
