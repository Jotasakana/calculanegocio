// हिन्दी में सूची: वे श्रेणियाँ जिनमें अभी कोई कैलकुलेटर उपलब्ध नहीं, और विकास में चल रहे कैलकुलेटरों के पाठ।
// कुंजियाँ src/domain/catalog.js से मेल खाती हैं। किसी एक देश के कर टूल (इनवॉइस पर कटौती, खुदरा अधिभार)
// हिन्दी में नहीं दिए जाते, इसलिए उनकी प्रविष्टि यहाँ नहीं है।

export const catalog = {
  categories: {
    finanzas: {
      title: 'कारोबार का वित्त',
      short: 'क़र्ज़, मूल्यह्रास, स्टॉक और नकदी भंडार',
    },
  },
  planned: {
    marketplace: { title: 'मार्केटप्लेस शुल्क', desc: 'मार्जिन गँवाए बिना किसी प्लेटफ़ॉर्म पर बेचने का न्यूनतम मूल्य निकालें।', search: 'marketplace मार्केटप्लेस fee शुल्क commission कमीशन platform प्लेटफ़ॉर्म online ऑनलाइन बिक्री amazon flipkart' },
    hora: { title: 'प्रति घंटा दर', desc: 'अपने ख़र्च और बिल योग्य घंटों से अंदाज़ा लगाएँ कि प्रति घंटा कितना लेना चाहिए।', search: 'hourly rate प्रति घंटा दर freelance फ़्रीलांस fees फ़ीस billable hours' },
    variacion: { title: 'प्रतिशत बदलाव', desc: 'दो अवधियों की तुलना करें और देखें कि कोई आँकड़ा कितना बढ़ा या घटा।', search: 'percentage change प्रतिशत बदलाव increase बढ़ोतरी decrease कमी growth' },
    roas: { title: 'विज्ञापन अभियान का रिटर्न (ROAS)', desc: 'विज्ञापन पर लगाई गई हर इकाई पर कितनी आय हुई, यह देखें (ROAS)।', search: 'roas advertising विज्ञापन campaign अभियान ads return रिटर्न' },
    prestamo: { title: 'लोन की किस्त', desc: 'नियमित किस्त, ब्याज और कुल चुकाई जाने वाली रक़म निकालें।', search: 'loan लोन emi किस्त payment interest ब्याज credit क़र्ज़ financing' },
    amortizacion: { title: 'सीधी रेखा विधि से मूल्यह्रास', desc: 'किसी संपत्ति की लागत को उसकी उपयोगी आयु में बाँटें।', search: 'depreciation मूल्यह्रास straight-line asset संपत्ति useful life उपयोगी आयु' },
    stock: { title: 'स्टॉक की खपत दर', desc: 'मापें कि एक अवधि में आपका माल कितनी बार बदलता है।', search: 'stock turnover स्टॉक खपत inventory इन्वेंट्री माल' },
    tesoreria: { title: 'नकदी भंडार', desc: 'निकालें कि आपके पास मौजूद नकदी कितने महीनों का ख़र्च चला सकती है।', search: 'cash reserve नकदी भंडार runway liquidity महीने ख़र्च expenses' },
  },
};
