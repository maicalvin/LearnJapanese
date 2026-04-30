// ============================================================
//  TABIJI — Lessons / Modules Data
//  7 travel scenario modules, 10–15 phrases each
// ============================================================

/* global LESSONS */
const LESSONS = [

  // ──────────────────────────────────────────────────────────
  // MODULE 1: Airport & Immigration
  // ──────────────────────────────────────────────────────────
  {
    id: "airport",
    name: "Airport & Immigration",
    emoji: "✈️",
    color: "#5ba4f5",
    description: "Land confidently. Navigate immigration, customs, and arrivals.",
    phrases: [
      {
        jp: "パスポートを見せてください。",
        rom: "Pasupōto o misete kudasai.",
        en: "Please show me your passport.",
        tip: "Immigration officers will ask for your passport. Have it ready before reaching the counter."
      },
      {
        jp: "観光です。",
        rom: "Kankō desu.",
        en: "I'm here for sightseeing / tourism.",
        tip: "When asked the purpose of your visit, this is the standard phrase for tourists."
      },
      {
        jp: "一週間滞在します。",
        rom: "Isshūkan taizai shimasu.",
        en: "I will stay for one week.",
        tip: "Replace 'isshūkan' with the right duration: ichinichi (1 day), futsuka (2 days), etc."
      },
      {
        jp: "申告するものはありません。",
        rom: "Shinkoku suru mono wa arimasen.",
        en: "I have nothing to declare.",
        tip: "Say this at customs if you are not carrying restricted goods."
      },
      {
        jp: "荷物を紛失しました。",
        rom: "Nimotsu o funshitsu shimashita.",
        en: "I lost my luggage.",
        tip: "Go to the airline's baggage claim counter and show your luggage tag if you have one."
      },
      {
        jp: "手荷物受取所はどこですか？",
        rom: "Tenimotsu uketori-jo wa doko desu ka?",
        en: "Where is the baggage claim area?",
        tip: "Look for signs with 到着 (tōchaku = arrival) or ask any airport staff."
      },
      {
        jp: "両替所はどこですか？",
        rom: "Ryōgaejo wa doko desu ka?",
        en: "Where is the currency exchange?",
        tip: "Airport exchange rates are often poor. Convenience store ATMs (7-Eleven) usually offer better rates."
      },
      {
        jp: "市内へ行くバスはどれですか？",
        rom: "Shinai e iku basu wa dore desu ka?",
        en: "Which bus goes to the city center?",
        tip: "Most major airports have affordable limousine bus services to the city."
      },
      {
        jp: "成田エクスプレスはどこから乗れますか？",
        rom: "Narita Ekusupuresu wa doko kara noremasu ka?",
        en: "Where do I board the Narita Express?",
        tip: "The Narita Express (N'EX) connects Narita Airport to Tokyo in about 60 minutes."
      },
      {
        jp: "Suicaを買いたいのですが。",
        rom: "Suika o kaitai no desu ga.",
        en: "I would like to buy a Suica card.",
        tip: "Suica is a reloadable IC card usable on trains, buses, and even at convenience stores."
      },
      {
        jp: "Wi-Fiはどこでレンタルできますか？",
        rom: "Wai-fai wa doko de rentaru dekimasu ka?",
        en: "Where can I rent Wi-Fi?",
        tip: "Pocket Wi-Fi rental counters are available at major airports—book online beforehand for better rates."
      },
      {
        jp: "トイレはどこですか？",
        rom: "Toire wa doko desu ka?",
        en: "Where is the restroom?",
        tip: "Japanese restrooms are world-class—don't be surprised by heated seats and bidet functions!"
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // MODULE 2: Transportation
  // ──────────────────────────────────────────────────────────
  {
    id: "transport",
    name: "Transportation",
    emoji: "🚅",
    color: "#52c97d",
    description: "Trains, buses, and taxis. Get anywhere in Japan with confidence.",
    phrases: [
      {
        jp: "〇〇まで一枚ください。",
        rom: "[Destination] made ichimai kudasai.",
        en: "One ticket to [destination], please.",
        tip: "Replace 〇〇 with your destination. Ticket machines often have an English mode."
      },
      {
        jp: "この電車は〇〇に止まりますか？",
        rom: "Kono densha wa [destination] ni tomarimasu ka?",
        en: "Does this train stop at [destination]?",
        tip: "Japan has express (急行), rapid (快速), and local (各駅停車) trains—always confirm!"
      },
      {
        jp: "どこで乗り換えればいいですか？",
        rom: "Doko de norikae reba ii desu ka?",
        en: "Where should I transfer?",
        tip: "Use Google Maps or the Jorudan app for easy transfer guidance in English."
      },
      {
        jp: "終電は何時ですか？",
        rom: "Shūden wa nanji desu ka?",
        en: "What time is the last train?",
        tip: "Last trains in Japan are usually around midnight. Missing it means a late-night taxi or manga café."
      },
      {
        jp: "〇〇駅まで行ってください。",
        rom: "[Destination]-eki made itte kudasai.",
        en: "Please take me to [destination] station.",
        tip: "Show the driver your destination written in Japanese—taxi drivers rarely speak English."
      },
      {
        jp: "ここで止めてください。",
        rom: "Koko de tomete kudasai.",
        en: "Please stop here.",
        tip: "Taxis in Japan have automatic doors—don't try to open or close them yourself!"
      },
      {
        jp: "メーターで行ってください。",
        rom: "Mētā de itte kudasai.",
        en: "Please go by the meter.",
        tip: "Taxi meters in Japan are standard and reliable—you should always be charged by meter."
      },
      {
        jp: "新幹線の指定席を予約したいです。",
        rom: "Shinkansen no shiteiseki o yoyaku shitai desu.",
        en: "I'd like to reserve a shinkansen seat.",
        tip: "Reserved seats (指定席) are recommended on busy routes. Book at the ticket counter or online."
      },
      {
        jp: "ICカードにチャージしたいです。",
        rom: "IC kādo ni chāji shitai desu.",
        en: "I'd like to recharge my IC card.",
        tip: "Find green ticket machines at any station—select 'charge' and insert your card and cash."
      },
      {
        jp: "このバスは〇〇に行きますか？",
        rom: "Kono basu wa [destination] ni ikimasu ka?",
        en: "Does this bus go to [destination]?",
        tip: "Buses in Japan usually have a route number displayed. Pay when exiting, not entering."
      },
      {
        jp: "道路が混んでいますか？",
        rom: "Dōro ga konde imasu ka?",
        en: "Is the road congested?",
        tip: "Tokyo traffic can be heavy. If time is critical, trains are faster than taxis."
      },
      {
        jp: "荷物を置いても大丈夫ですか？",
        rom: "Nimotsu o oite mo daijōbu desu ka?",
        en: "Is it okay to put my luggage here?",
        tip: "During rush hour, bringing large bags on trains is discouraged. Use coin lockers or takuhaibin."
      },
      {
        jp: "乗り換えは何回ですか？",
        rom: "Norikae wa nankai desu ka?",
        en: "How many transfers are there?",
        tip: "Train apps will show the number of transfers for your route automatically."
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // MODULE 3: Hotel Check-in/out
  // ──────────────────────────────────────────────────────────
  {
    id: "hotel",
    name: "Hotel Check-in/out",
    emoji: "🏨",
    color: "#f4a261",
    description: "Arrive, settle in, and check out smoothly at any Japanese hotel.",
    phrases: [
      {
        jp: "チェックインをお願いします。",
        rom: "Chekku-in o onegaishimasu.",
        en: "I'd like to check in, please.",
        tip: "Standard check-in time in Japan is 3:00 PM. Arrive early? Ask if your room is ready."
      },
      {
        jp: "予約した〇〇です。",
        rom: "Yoyaku shita [your name] desu.",
        en: "I have a reservation. My name is [name].",
        tip: "Have your booking confirmation ready on your phone or printed."
      },
      {
        jp: "朝食は付いていますか？",
        rom: "Chōshoku wa tsuite imasu ka?",
        en: "Is breakfast included?",
        tip: "Japanese hotel breakfasts often include both Western and Japanese options—worth trying!"
      },
      {
        jp: "Wi-Fiのパスワードを教えてください。",
        rom: "Waifai no pasuwādo o oshiete kudasai.",
        en: "Could you tell me the Wi-Fi password?",
        tip: "Most hotels offer free Wi-Fi. The password is often printed on a card in your room."
      },
      {
        jp: "部屋の鍵をなくしました。",
        rom: "Heya no kagi o nakushimashita.",
        en: "I lost my room key.",
        tip: "Go to the front desk immediately with your passport for verification."
      },
      {
        jp: "タオルを追加でいただけますか？",
        rom: "Taoru o tsuika de itadakemasu ka?",
        en: "Could I have additional towels?",
        tip: "In Japan, it's common to call the front desk rather than stop staff in the hallway."
      },
      {
        jp: "エアコンの使い方を教えてください。",
        rom: "Eakon no tsukaikata o oshiete kudasai.",
        en: "Could you show me how to use the air conditioner?",
        tip: "Japanese AC remote controls are often only in Japanese—ask the staff to demonstrate."
      },
      {
        jp: "チェックアウトをお願いします。",
        rom: "Chekku-auto o onegaishimasu.",
        en: "I'd like to check out, please.",
        tip: "Standard checkout is 11:00 AM. Late checkout is sometimes available for a fee—ask the front desk."
      },
      {
        jp: "荷物を預かってもらえますか？",
        rom: "Nimotsu o azukatte moraemasu ka?",
        en: "Could you keep my luggage for me?",
        tip: "Hotels will hold your bags after checkout. Very helpful for exploring on your last day."
      },
      {
        jp: "領収書をください。",
        rom: "Ryōshūsho o kudasai.",
        en: "A receipt, please.",
        tip: "Keep receipts for business travel expense reports. Hotels can provide detailed itemized receipts."
      },
      {
        jp: "近くにコンビニはありますか？",
        rom: "Chikaku ni konbini wa arimasu ka?",
        en: "Is there a convenience store nearby?",
        tip: "Japanese convenience stores (コンビニ) are open 24/7 and sell hot food, snacks, and toiletries."
      },
      {
        jp: "おすすめのレストランはありますか？",
        rom: "Osusume no resutoran wa arimasu ka?",
        en: "Do you have any restaurant recommendations?",
        tip: "Hotel staff know the area well and are happy to suggest local favorites—don't hesitate to ask!"
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // MODULE 4: Ordering Food
  // ──────────────────────────────────────────────────────────
  {
    id: "food",
    name: "Ordering Food",
    emoji: "🍜",
    color: "#e8624a",
    description: "Order food confidently. Handle allergies, menus, and payment.",
    phrases: [
      {
        jp: "メニューを見せてください。",
        rom: "Menyū o misete kudasai.",
        en: "Please show me the menu.",
        tip: "Many restaurants have picture menus or plastic food displays outside—great for pointing!"
      },
      {
        jp: "これをください。",
        rom: "Kore o kudasai.",
        en: "I'll have this one, please.",
        tip: "Pointing at the menu or picture is perfectly acceptable in Japanese restaurants."
      },
      {
        jp: "おすすめは何ですか？",
        rom: "Osusume wa nan desu ka?",
        en: "What do you recommend?",
        tip: "Many restaurants have a 'chef's recommendation' item. The staff love sharing their favorites!"
      },
      {
        jp: "〇〇アレルギーがあります。",
        rom: "[Allergen] arerugī ga arimasu.",
        en: "I have a [allergen] allergy.",
        tip: "Key allergens: 卵 (tamago=egg), 小麦 (komugi=wheat), 乳 (nyū=dairy), 海老 (ebi=shrimp), ナッツ (nattsu=nuts)."
      },
      {
        jp: "ベジタリアンメニューはありますか？",
        rom: "Bejitarian menyū wa arimasu ka?",
        en: "Do you have a vegetarian menu?",
        tip: "Japan's 精進料理 (shōjin ryōri) is traditional Buddhist vegetarian cuisine—look for it at temples."
      },
      {
        jp: "注文してもいいですか？",
        rom: "Chūmon shite mo ii desu ka?",
        en: "May I order now?",
        tip: "In Japan, you call staff with すみません (sumimasen) rather than waving hands excessively."
      },
      {
        jp: "水をいただけますか？",
        rom: "Mizu o itadakemasu ka?",
        en: "Could I have some water?",
        tip: "Many restaurants in Japan serve free cold water automatically. If not, simply ask!"
      },
      {
        jp: "辛くしないでください。",
        rom: "Karakunai de kudasai.",
        en: "Please don't make it spicy.",
        tip: "Some dishes like curry have spice levels (甘口、中辛、辛口). Ask for 甘口 (amakuchi) for mild."
      },
      {
        jp: "大盛りにしてください。",
        rom: "Ōmori ni shite kudasai.",
        en: "Large serving, please.",
        tip: "Many ramen and rice restaurants offer 大盛り (large) for free or a small fee."
      },
      {
        jp: "お会計をお願いします。",
        rom: "Okaikei o onegaishimasu.",
        en: "Check, please.",
        tip: "In Japan, you usually pay at a register, not at the table. No tipping is ever required."
      },
      {
        jp: "クレジットカードは使えますか？",
        rom: "Kurejitto kādo wa tsukaemasu ka?",
        en: "Do you accept credit cards?",
        tip: "Many smaller restaurants are cash-only (現金のみ). Always carry some yen just in case."
      },
      {
        jp: "ごちそうさまでした！",
        rom: "Gochisōsama deshita!",
        en: "Thank you for the meal! (said after eating)",
        tip: "Saying this as you leave shows appreciation—staff will be delighted by your politeness."
      },
      {
        jp: "持ち帰りできますか？",
        rom: "Mochikaeri dekimasu ka?",
        en: "Can I take this to go?",
        tip: "Takeout is common at fast food, but many sit-down restaurants don't offer it—always ask first."
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // MODULE 5: Shopping
  // ──────────────────────────────────────────────────────────
  {
    id: "shopping",
    name: "Shopping",
    emoji: "🛍️",
    color: "#9b8ef8",
    description: "Shop smart. Ask for prices, sizes, gift wrapping, and tax refunds.",
    phrases: [
      {
        jp: "これはいくらですか？",
        rom: "Kore wa ikura desu ka?",
        en: "How much is this?",
        tip: "Prices in Japan always include 10% consumption tax unless labelled as 税抜き (pre-tax)."
      },
      {
        jp: "もっと安いものはありますか？",
        rom: "Motto yasui mono wa arimasu ka?",
        en: "Is there something cheaper?",
        tip: "Department stores have sales, and discount shops like Don Quijote (ドン・キホーテ) offer great deals."
      },
      {
        jp: "これを試着してもいいですか？",
        rom: "Kore o shichaku shite mo ii desu ka?",
        en: "May I try this on?",
        tip: "Most fitting rooms in Japan are well-maintained and organized. Look for 試着室 (shichaku-shitsu) signs."
      },
      {
        jp: "Mサイズはありますか？",
        rom: "Emu saizu wa arimasu ka?",
        en: "Do you have size M?",
        tip: "Japanese clothing sizes run small. S/M/L labels differ from Western standards—always try on."
      },
      {
        jp: "別の色はありますか？",
        rom: "Betsu no iro wa arimasu ka?",
        en: "Do you have another color?",
        tip: "Japanese stores often have back stock—don't hesitate to ask, staff are eager to help."
      },
      {
        jp: "ギフト用に包んでいただけますか？",
        rom: "Gifuto-yō ni tsutsunde itadakemasu ka?",
        en: "Could you gift-wrap this, please?",
        tip: "Gift wrapping in Japan is an art. Department stores offer beautiful free wrapping."
      },
      {
        jp: "免税で購入できますか？",
        rom: "Menzei de kōnyū dekimasu ka?",
        en: "Can I buy this tax-free?",
        tip: "Tourists can get 10% tax refunded on purchases over 5,000 yen at participating stores. Show your passport!"
      },
      {
        jp: "これを返品したいのですが。",
        rom: "Kore o henpin shitai no desu ga.",
        en: "I'd like to return this.",
        tip: "Returns in Japan require a receipt and the item unused in original packaging."
      },
      {
        jp: "袋はいりません。",
        rom: "Fukuro wa irimasen.",
        en: "I don't need a bag.",
        tip: "Japan charges for plastic bags—saying this saves money and helps the environment."
      },
      {
        jp: "クレジットカードは使えますか？",
        rom: "Kurejitto kādo wa tsukaemasu ka?",
        en: "Do you accept credit cards?",
        tip: "Convenience stores and department stores usually do. Small shops may be cash-only."
      },
      {
        jp: "Suicaで払えますか？",
        rom: "Suika de haraemasu ka?",
        en: "Can I pay with Suica?",
        tip: "Suica and other IC cards work at many convenience stores and some vending machines."
      },
      {
        jp: "これは人気ですか？",
        rom: "Kore wa ninki desu ka?",
        en: "Is this popular?",
        tip: "Asking staff this question often unlocks great recommendations and local insight."
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // MODULE 6: Asking for Directions
  // ──────────────────────────────────────────────────────────
  {
    id: "directions",
    name: "Asking for Directions",
    emoji: "🗺️",
    color: "#4ecdc4",
    description: "Find your way anywhere. Ask locals and understand their directions.",
    phrases: [
      {
        jp: "〇〇はどこですか？",
        rom: "[Place] wa doko desu ka?",
        en: "Where is [place]?",
        tip: "This is the most useful direction question. Replace 〇〇 with any place name."
      },
      {
        jp: "歩いて何分かかりますか？",
        rom: "Aruite nanpun kakarimasu ka?",
        en: "How many minutes on foot?",
        tip: "Japanese people often give distances in walking time rather than meters."
      },
      {
        jp: "地図を見せてもらえますか？",
        rom: "Chizu o misete moraemasu ka?",
        en: "Could you show me on a map?",
        tip: "Use Google Maps on your phone—show the Japanese person the screen and ask them to point."
      },
      {
        jp: "この住所に行きたいのですが。",
        rom: "Kono jūsho ni ikitai no desu ga.",
        en: "I want to go to this address.",
        tip: "Show the address on your phone. Japanese addresses are read district → block → building number."
      },
      {
        jp: "右に曲がってください。",
        rom: "Migi ni magatte kudasai.",
        en: "Please turn right.",
        tip: "Practice the cardinal directions: 右 (migi=right), 左 (hidari=left), まっすぐ (massugu=straight)."
      },
      {
        jp: "次の信号を左に曲がってください。",
        rom: "Tsugi no shingō o hidari ni magatte kudasai.",
        en: "Please turn left at the next traffic light.",
        tip: "Traffic lights are called 信号 (shingō). Very useful landmark for directions."
      },
      {
        jp: "道に迷いました。",
        rom: "Michi ni mayoimashita.",
        en: "I'm lost.",
        tip: "Japanese people are very helpful. Showing this phrase to someone will always get assistance."
      },
      {
        jp: "この地図でどこですか？",
        rom: "Kono chizu de doko desu ka?",
        en: "Where is it on this map?",
        tip: "Tourist maps are available free at train stations and tourist information centers."
      },
      {
        jp: "〇〇の近くですか？",
        rom: "[Landmark] no chikaku desu ka?",
        en: "Is it near [landmark]?",
        tip: "Using well-known landmarks makes it easier for people to give you clear directions."
      },
      {
        jp: "すみません、もう一度ゆっくり言ってください。",
        rom: "Sumimasen, mō ichido yukkuri itte kudasai.",
        en: "Excuse me, please say that again slowly.",
        tip: "Don't be shy—most people will happily repeat more slowly or even draw a map for you."
      },
      {
        jp: "そこまで一緒に来てもらえますか？",
        rom: "Soko made issho ni kite moraemasu ka?",
        en: "Could you take me there?",
        tip: "In Japan, many people will actually walk you to your destination—a remarkably kind gesture!"
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // MODULE 7: Emergencies
  // ──────────────────────────────────────────────────────────
  {
    id: "emergency",
    name: "Emergencies",
    emoji: "🚨",
    color: "#e74c3c",
    description: "Stay safe. Key phrases for medical help, police, and urgent situations.",
    phrases: [
      {
        jp: "助けてください！",
        rom: "Tasukete kudasai!",
        en: "Help me!",
        tip: "Shout this loudly in an emergency. Japanese people will respond quickly."
      },
      {
        jp: "救急車を呼んでください！",
        rom: "Kyūkyūsha o yonde kudasai!",
        en: "Please call an ambulance!",
        tip: "Japan's emergency number for ambulance and fire is 119. Police is 110."
      },
      {
        jp: "警察を呼んでください！",
        rom: "Keisatsu o yonde kudasai!",
        en: "Please call the police!",
        tip: "You can call 110 for police anywhere in Japan. Say '英語を話せる人はいますか' for an English speaker."
      },
      {
        jp: "病院に連れて行ってください。",
        rom: "Byōin ni tsurete itte kudasai.",
        en: "Please take me to the hospital.",
        tip: "Show this phrase to a taxi driver or hotel staff if you need urgent medical attention."
      },
      {
        jp: "ここが痛いです。",
        rom: "Koko ga itai desu.",
        en: "It hurts here.",
        tip: "Point to the affected area when saying this to a doctor or nurse."
      },
      {
        jp: "薬のアレルギーがあります。",
        rom: "Kusuri no arerugī ga arimasu.",
        en: "I have a medication allergy.",
        tip: "Write down your specific medication allergy name in advance and carry it with you."
      },
      {
        jp: "財布を盗まれました。",
        rom: "Saifu o nusumaremashita.",
        en: "My wallet was stolen.",
        tip: "Go to the nearest police box (交番, kōban) and file a report. Contact your embassy too."
      },
      {
        jp: "パスポートをなくしました。",
        rom: "Pasupōto o nakushimashita.",
        en: "I lost my passport.",
        tip: "Report to the nearest police box first, then contact your country's embassy in Japan."
      },
      {
        jp: "旅行保険に入っています。",
        rom: "Ryokō hoken ni haitte imasu.",
        en: "I have travel insurance.",
        tip: "Keep your insurance card and policy number accessible. Japan's healthcare is excellent but not free."
      },
      {
        jp: "英語を話せる人はいますか？",
        rom: "Eigo o hanaseru hito wa imasu ka?",
        en: "Is there anyone who speaks English?",
        tip: "Tourist police lines and some hospitals have English-speaking staff available."
      },
      {
        jp: "大使館に連絡したいです。",
        rom: "Taishikan ni renraku shitai desu.",
        en: "I want to contact my embassy.",
        tip: "Save your country's Japan embassy phone number in your phone before traveling."
      },
      {
        jp: "気分が悪いです。",
        rom: "Kibun ga warui desu.",
        en: "I feel sick.",
        tip: "If on a train and feeling unwell, get off at the next station and find station staff immediately."
      },
      {
        jp: "これは緊急事態です。",
        rom: "Kore wa kinkyū jitai desu.",
        en: "This is an emergency.",
        tip: "Use this phrase to communicate urgency when language is a barrier."
      }
    ]
  }

];

// Expose for modules
if (typeof module !== 'undefined') module.exports = LESSONS;
