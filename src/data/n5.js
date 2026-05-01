import { createDeck, createKanjiCard } from "./schema.js";

const rawN5Cards = [
  {
    "id": "北",
    "kanji": "北",
    "meaningsFr": ["nord"],
    "onyomi": "ホク",
    "kunyomi": "きた",
    "onyomiExampleJp": "北海道",
    "onyomiExampleReading": "ほっかいどう",
    "onyomiExampleFr": "Hokkaidō",
    "kunyomiExampleJp": "北口",
    "kunyomiExampleReading": "きたぐち",
    "kunyomiExampleFr": "sortie nord"
  },
  {
    "id": "百",
    "kanji": "百",
    "meaningsFr": ["cent"],
    "onyomi": "ヒャク",
    "kunyomi": "",
    "onyomiExampleJp": "百円",
    "onyomiExampleReading": "ひゃくえん",
    "onyomiExampleFr": "cent yens"
  },
  {
    "id": "白",
    "kanji": "白",
    "meaningsFr": ["blanc"],
    "onyomi": "ハク",
    "kunyomi": "しろい",
    "onyomiExampleJp": "白紙",
    "onyomiExampleReading": "はくし",
    "onyomiExampleFr": "feuille blanche",
    "kunyomiExampleJp": "白い",
    "kunyomiExampleReading": "しろい",
    "kunyomiExampleFr": "blanc"
  },
  {
    "id": "半",
    "kanji": "半",
    "meaningsFr": ["moitié"],
    "onyomi": "ハン",
    "kunyomi": "",
    "onyomiExampleJp": "半分",
    "onyomiExampleReading": "はんぶん",
    "onyomiExampleFr": "moitié"
  },
  {
    "id": "本",
    "kanji": "本",
    "meaningsFr": [
      "livre",
      "origine"
    ],
    "onyomi": "ホン",
    "kunyomi": "",
    "onyomiExampleJp": "本屋",
    "onyomiExampleReading": "ほんや",
    "onyomiExampleFr": "librairie"
  },
  {
    "id": "八",
    "kanji": "八",
    "meaningsFr": ["huit"],
    "onyomi": "ハチ",
    "kunyomi": "やっつ",
    "onyomiExampleJp": "八時",
    "onyomiExampleReading": "はちじ",
    "onyomiExampleFr": "huit heures",
    "kunyomiExampleJp": "八つ",
    "kunyomiExampleReading": "やっつ",
    "kunyomiExampleFr": "huit objets"
  },
  {
    "id": "高",
    "kanji": "高",
    "meaningsFr": [
      "haut",
      "cher"
    ],
    "onyomi": "コウ",
    "kunyomi": "たかい",
    "onyomiExampleJp": "高校",
    "onyomiExampleReading": "こうこう",
    "onyomiExampleFr": "lycée",
    "kunyomiExampleJp": "高い",
    "kunyomiExampleReading": "たかい",
    "kunyomiExampleFr": "cher"
  },
  {
    "id": "九",
    "kanji": "九",
    "meaningsFr": ["neuf"],
    "onyomi": "キュウ",
    "kunyomi": "ここのつ",
    "onyomiExampleJp": "九時",
    "onyomiExampleReading": "くじ",
    "onyomiExampleFr": "neuf heures",
    "kunyomiExampleJp": "九つ",
    "kunyomiExampleReading": "ここのつ",
    "kunyomiExampleFr": "neuf objets"
  },
  {
    "id": "大",
    "kanji": "大",
    "meaningsFr": ["grand"],
    "onyomi": "ダイ",
    "kunyomi": "おおきい",
    "onyomiExampleJp": "大学",
    "onyomiExampleReading": "だいがく",
    "onyomiExampleFr": "université",
    "kunyomiExampleJp": "大きい",
    "kunyomiExampleReading": "おおきい",
    "kunyomiExampleFr": "grand"
  },
  {
    "id": "名",
    "kanji": "名",
    "meaningsFr": ["nom"],
    "onyomi": "メイ",
    "kunyomi": "な",
    "onyomiExampleJp": "有名",
    "onyomiExampleReading": "ゆうめい",
    "onyomiExampleFr": "célèbre",
    "kunyomiExampleJp": "名前",
    "kunyomiExampleReading": "なまえ",
    "kunyomiExampleFr": "nom"
  },
  {
    "id": "電",
    "kanji": "電",
    "meaningsFr": ["electricite"],
    "onyomi": "デン",
    "kunyomi": "",
    "onyomiExampleJp": "電話",
    "onyomiExampleReading": "でんわ",
    "onyomiExampleFr": "telephone"
  },
  {
    "id": "読",
    "kanji": "読",
    "meaningsFr": ["lire"],
    "onyomi": "ドク",
    "kunyomi": "よむ",
    "onyomiExampleJp": "読書",
    "onyomiExampleReading": "どくしょ",
    "onyomiExampleFr": "lecture",
    "kunyomiExampleJp": "読む",
    "kunyomiExampleReading": "よむ",
    "kunyomiExampleFr": "lire"
  },
  {
    "id": "東",
    "kanji": "東",
    "meaningsFr": ["est"],
    "onyomi": "トウ",
    "kunyomi": "ひがし",
    "onyomiExampleJp": "東京",
    "onyomiExampleReading": "とうきょう",
    "onyomiExampleFr": "Tokyo",
    "kunyomiExampleJp": "東",
    "kunyomiExampleReading": "ひがし",
    "kunyomiExampleFr": "est"
  },
  {
    "id": "間",
    "kanji": "間",
    "meaningsFr": [
      "entre",
      "intervalle"
    ],
    "onyomi": "カン",
    "kunyomi": "あいだ",
    "onyomiExampleJp": "時間",
    "onyomiExampleReading": "じかん",
    "onyomiExampleFr": "temps",
    "kunyomiExampleJp": "間",
    "kunyomiExampleReading": "あいだ",
    "kunyomiExampleFr": "entre"
  },
  {
    "id": "何",
    "kanji": "何",
    "meaningsFr": ["quoi"],
    "onyomi": "",
    "kunyomi": "なに / なん",
    "kunyomiExamples": [
      {
        "kana": "なに",
        "jp": "何ですか",
        "reading": "なにですか",
        "fr": "qu'est-ce que c'est ?"
      },
      {
        "kana": "なん",
        "jp": "何人",
        "reading": "なんにん",
        "fr": "combien de personnes"
      }
    ]
  },
  {
    "id": "下",
    "kanji": "下",
    "meaningsFr": [
      "bas",
      "dessous"
    ],
    "onyomi": "カ",
    "kunyomi": "した",
    "onyomiExampleJp": "地下",
    "onyomiExampleReading": "ちか",
    "onyomiExampleFr": "sous-sol",
    "kunyomiExampleJp": "下",
    "kunyomiExampleReading": "した",
    "kunyomiExampleFr": "dessous"
  },
  {
    "id": "行",
    "kanji": "行",
    "meaningsFr": [
      "aller",
      "faire"
    ],
    "onyomi": "コウ",
    "kunyomi": "いく",
    "onyomiExampleJp": "銀行",
    "onyomiExampleReading": "ぎんこう",
    "onyomiExampleFr": "banque",
    "kunyomiExampleJp": "行く",
    "kunyomiExampleReading": "いく",
    "kunyomiExampleFr": "aller"
  },
  {
    "id": "後",
    "kanji": "後",
    "meaningsFr": [
      "apres",
      "derriere"
    ],
    "onyomi": "ゴ",
    "kunyomi": "あと",
    "onyomiExampleJp": "午後",
    "onyomiExampleReading": "ごご",
    "onyomiExampleFr": "après-midi",
    "kunyomiExampleJp": "後で",
    "kunyomiExampleReading": "あとで",
    "kunyomiExampleFr": "plus tard"
  },
  {
    "id": "校",
    "kanji": "校",
    "meaningsFr": ["école"],
    "onyomi": "コウ",
    "kunyomi": "",
    "onyomiExampleJp": "学校",
    "onyomiExampleReading": "がっこう",
    "onyomiExampleFr": "école"
  },
  {
    "id": "火",
    "kanji": "火",
    "meaningsFr": ["feu"],
    "onyomi": "カ",
    "kunyomi": "ひ",
    "onyomiExampleJp": "火山",
    "onyomiExampleReading": "かざん",
    "onyomiExampleFr": "volcan",
    "kunyomiExampleJp": "火",
    "kunyomiExampleReading": "ひ",
    "kunyomiExampleFr": "feu"
  },
  {
    "id": "学",
    "kanji": "学",
    "meaningsFr": [
      "etudier",
      "apprentissage"
    ],
    "onyomi": "ガク",
    "kunyomi": "まなぶ",
    "onyomiExampleJp": "学校",
    "onyomiExampleReading": "がっこう",
    "onyomiExampleFr": "école",
    "kunyomiExampleJp": "学ぶ",
    "kunyomiExampleReading": "まなぶ",
    "kunyomiExampleFr": "etudier"
  },
  {
    "id": "休",
    "kanji": "休",
    "meaningsFr": [
      "repos",
      "se reposer"
    ],
    "onyomi": "キュウ",
    "kunyomi": "やすむ",
    "onyomiExampleJp": "休日",
    "onyomiExampleReading": "きゅうじつ",
    "onyomiExampleFr": "jour de repos",
    "kunyomiExampleJp": "休む",
    "kunyomiExampleReading": "やすむ",
    "kunyomiExampleFr": "se reposer"
  },
  {
    "id": "友",
    "kanji": "友",
    "meaningsFr": ["ami"],
    "onyomi": "ユウ",
    "kunyomi": "とも",
    "onyomiExampleJp": "友人",
    "onyomiExampleReading": "ゆうじん",
    "onyomiExampleFr": "ami",
    "kunyomiExampleJp": "友だち",
    "kunyomiExampleReading": "ともだち",
    "kunyomiExampleFr": "copain"
  },
  {
    "id": "右",
    "kanji": "右",
    "meaningsFr": ["droite"],
    "onyomi": "ウ",
    "kunyomi": "みぎ",
    "onyomiExampleJp": "右折",
    "onyomiExampleReading": "うせつ",
    "onyomiExampleFr": "tourner a droite",
    "kunyomiExampleJp": "右",
    "kunyomiExampleReading": "みぎ",
    "kunyomiExampleFr": "droite"
  },
  {
    "id": "気",
    "kanji": "気",
    "meaningsFr": [
      "esprit",
      "air",
      "energie"
    ],
    "onyomi": "キ",
    "kunyomi": "",
    "onyomiExampleJp": "元気",
    "onyomiExampleReading": "げんき",
    "onyomiExampleFr": "en forme"
  },
  {
    "id": "見",
    "kanji": "見",
    "meaningsFr": ["voir"],
    "onyomi": "ケン",
    "kunyomi": "みる",
    "onyomiExampleJp": "見学",
    "onyomiExampleReading": "けんがく",
    "onyomiExampleFr": "visite d'étude",
    "kunyomiExampleJp": "見る",
    "kunyomiExampleReading": "みる",
    "kunyomiExampleFr": "regarder"
  },
  {
    "id": "今",
    "kanji": "今",
    "meaningsFr": ["maintenant"],
    "onyomi": "コン",
    "kunyomi": "いま",
    "onyomiExampleJp": "今回",
    "onyomiExampleReading": "こんかい",
    "onyomiExampleFr": "cette fois-ci",
    "kunyomiExampleJp": "今",
    "kunyomiExampleReading": "いま",
    "kunyomiExampleFr": "maintenant"
  },
  {
    "id": "金",
    "kanji": "金",
    "meaningsFr": [
      "or",
      "argent (monnaie)"
    ],
    "onyomi": "キン",
    "kunyomi": "かね",
    "onyomiExampleJp": "金色",
    "onyomiExampleReading": "きんいろ",
    "onyomiExampleFr": "couleur or",
    "kunyomiExampleJp": "お金",
    "kunyomiExampleReading": "おかね",
    "kunyomiExampleFr": "argent (monnaie)"
  },
  {
    "id": "来",
    "kanji": "来",
    "meaningsFr": ["venir"],
    "onyomi": "ライ",
    "kunyomi": "くる",
    "onyomiExampleJp": "来週",
    "onyomiExampleReading": "らいしゅう",
    "onyomiExampleFr": "semaine prochaine",
    "kunyomiExampleJp": "来る",
    "kunyomiExampleReading": "くる",
    "kunyomiExampleFr": "venir"
  },
  {
    "id": "六",
    "kanji": "六",
    "meaningsFr": ["six"],
    "onyomi": "ロク",
    "kunyomi": "むっつ",
    "onyomiExampleJp": "六時",
    "onyomiExampleReading": "ろくじ",
    "onyomiExampleFr": "six heures",
    "kunyomiExampleJp": "六つ",
    "kunyomiExampleReading": "むっつ",
    "kunyomiExampleFr": "six objets"
  },
  {
    "id": "母",
    "kanji": "母",
    "meaningsFr": ["mere"],
    "onyomi": "ボ",
    "kunyomi": "はは",
    "onyomiExampleJp": "母国",
    "onyomiExampleReading": "ぼこく",
    "onyomiExampleFr": "pays natal",
    "kunyomiExampleJp": "母",
    "kunyomiExampleReading": "はは",
    "kunyomiExampleFr": "mere"
  },
  {
    "id": "木",
    "kanji": "木",
    "meaningsFr": [
      "arbre",
      "bois"
    ],
    "onyomi": "モク",
    "kunyomi": "き",
    "onyomiExampleJp": "木曜日",
    "onyomiExampleReading": "もくようび",
    "onyomiExampleFr": "jeudi",
    "kunyomiExampleJp": "木",
    "kunyomiExampleReading": "き",
    "kunyomiExampleFr": "arbre"
  },
  {
    "id": "毎",
    "kanji": "毎",
    "meaningsFr": ["chaque"],
    "onyomi": "マイ",
    "kunyomi": "",
    "onyomiExampleJp": "毎日",
    "onyomiExampleReading": "まいにち",
    "onyomiExampleFr": "tous les jours"
  },
  {
    "id": "男",
    "kanji": "男",
    "meaningsFr": ["homme"],
    "onyomi": "ダン",
    "kunyomi": "おとこ",
    "onyomiExampleJp": "男子",
    "onyomiExampleReading": "だんし",
    "onyomiExampleFr": "garcon",
    "kunyomiExampleJp": "男",
    "kunyomiExampleReading": "おとこ",
    "kunyomiExampleFr": "homme"
  },
  {
    "id": "南",
    "kanji": "南",
    "meaningsFr": ["sud"],
    "onyomi": "ナン",
    "kunyomi": "みなみ",
    "onyomiExampleJp": "南米",
    "onyomiExampleReading": "なんべい",
    "onyomiExampleFr": "Amerique du Sud",
    "kunyomiExampleJp": "南",
    "kunyomiExampleReading": "みなみ",
    "kunyomiExampleFr": "sud"
  },
  {
    "id": "午",
    "kanji": "午",
    "meaningsFr": ["midi"],
    "onyomi": "ゴ",
    "kunyomi": "",
    "onyomiExampleJp": "午後",
    "onyomiExampleReading": "ごご",
    "onyomiExampleFr": "après-midi"
  },
  {
    "id": "外",
    "kanji": "外",
    "meaningsFr": [
      "exterieur",
      "autre"
    ],
    "onyomi": "ガイ",
    "kunyomi": "そと",
    "onyomiExampleJp": "外国",
    "onyomiExampleReading": "がいこく",
    "onyomiExampleFr": "pays etranger",
    "kunyomiExampleJp": "外",
    "kunyomiExampleReading": "そと",
    "kunyomiExampleFr": "dehors"
  },
  {
    "id": "五",
    "kanji": "五",
    "meaningsFr": ["cinq"],
    "onyomi": "ゴ",
    "kunyomi": "いつつ",
    "onyomiExampleJp": "五月",
    "onyomiExampleReading": "ごがつ",
    "onyomiExampleFr": "mai",
    "kunyomiExampleJp": "五つ",
    "kunyomiExampleReading": "いつつ",
    "kunyomiExampleFr": "cinq objets"
  },
  {
    "id": "語",
    "kanji": "語",
    "meaningsFr": [
      "langue",
      "parler"
    ],
    "onyomi": "ゴ",
    "kunyomi": "",
    "onyomiExampleJp": "日本語",
    "onyomiExampleReading": "にほんご",
    "onyomiExampleFr": "japonais"
  },
  {
    "id": "月",
    "kanji": "月",
    "meaningsFr": [
      "mois",
      "lune"
    ],
    "onyomi": "ゲツ",
    "kunyomi": "つき",
    "onyomiExampleJp": "月曜日",
    "onyomiExampleReading": "げつようび",
    "onyomiExampleFr": "lundi",
    "kunyomiExampleJp": "月",
    "kunyomiExampleReading": "つき",
    "kunyomiExampleFr": "lune"
  },
  {
    "id": "人",
    "kanji": "人",
    "meaningsFr": ["personne"],
    "onyomi": "ジン",
    "kunyomi": "ひと",
    "onyomiExampleJp": "日本人",
    "onyomiExampleReading": "にほんじん",
    "onyomiExampleFr": "Japonais",
    "kunyomiExampleJp": "人",
    "kunyomiExampleReading": "ひと",
    "kunyomiExampleFr": "personne"
  },
  {
    "id": "入",
    "kanji": "入",
    "meaningsFr": ["entrer"],
    "onyomi": "ニュウ",
    "kunyomi": "はいる",
    "onyomiExampleJp": "入学",
    "onyomiExampleReading": "にゅうがく",
    "onyomiExampleFr": "entree a l'école",
    "kunyomiExampleJp": "入る",
    "kunyomiExampleReading": "はいる",
    "kunyomiExampleFr": "entrer"
  },
  {
    "id": "一",
    "kanji": "一",
    "meaningsFr": ["un"],
    "onyomi": "イチ",
    "kunyomi": "ひとつ",
    "onyomiExampleJp": "一年",
    "onyomiExampleReading": "いちねん",
    "onyomiExampleFr": "un an",
    "kunyomiExampleJp": "一つ",
    "kunyomiExampleReading": "ひとつ",
    "kunyomiExampleFr": "un objet"
  },
  {
    "id": "日",
    "kanji": "日",
    "meaningsFr": [
      "jour",
      "soleil"
    ],
    "onyomi": "ニチ",
    "kunyomi": "ひ",
    "onyomiExampleJp": "日本",
    "onyomiExampleReading": "にほん",
    "onyomiExampleFr": "Japon",
    "kunyomiExampleJp": "日",
    "kunyomiExampleReading": "ひ",
    "kunyomiExampleFr": "jour"
  },
  {
    "id": "二",
    "kanji": "二",
    "meaningsFr": ["deux"],
    "onyomi": "ニ",
    "kunyomi": "ふたつ",
    "onyomiExampleJp": "二月",
    "onyomiExampleReading": "にがつ",
    "onyomiExampleFr": "fevrier",
    "kunyomiExampleJp": "二つ",
    "kunyomiExampleReading": "ふたつ",
    "kunyomiExampleFr": "deux objets"
  },
  {
    "id": "年",
    "kanji": "年",
    "meaningsFr": ["annee"],
    "onyomi": "ネン",
    "kunyomi": "とし",
    "onyomiExampleJp": "来年",
    "onyomiExampleReading": "らいねん",
    "onyomiExampleFr": "annee prochaine",
    "kunyomiExampleJp": "年",
    "kunyomiExampleReading": "とし",
    "kunyomiExampleFr": "annee"
  },
  {
    "id": "女",
    "kanji": "女",
    "meaningsFr": ["femme"],
    "onyomi": "ジョ",
    "kunyomi": "おんな",
    "onyomiExampleJp": "女性",
    "onyomiExampleReading": "じょせい",
    "onyomiExampleFr": "femme",
    "kunyomiExampleJp": "女",
    "kunyomiExampleReading": "おんな",
    "kunyomiExampleFr": "femme"
  },
  {
    "id": "分",
    "kanji": "分",
    "meaningsFr": [
      "partie",
      "minute",
      "comprendre"
    ],
    "onyomi": "フン",
    "kunyomi": "わかる",
    "onyomiExampleJp": "五分",
    "onyomiExampleReading": "ごふん",
    "onyomiExampleFr": "cinq minutes",
    "kunyomiExampleJp": "分かる",
    "kunyomiExampleReading": "わかる",
    "kunyomiExampleFr": "comprendre"
  },
  {
    "id": "父",
    "kanji": "父",
    "meaningsFr": ["pere"],
    "onyomi": "フ",
    "kunyomi": "ちち",
    "onyomiExampleJp": "父母",
    "onyomiExampleReading": "ふぼ",
    "onyomiExampleFr": "pere et mere",
    "kunyomiExampleJp": "父",
    "kunyomiExampleReading": "ちち",
    "kunyomiExampleFr": "pere"
  },
  {
    "id": "国",
    "kanji": "国",
    "meaningsFr": ["pays"],
    "onyomi": "コク",
    "kunyomi": "くに",
    "onyomiExampleJp": "外国",
    "onyomiExampleReading": "がいこく",
    "onyomiExampleFr": "pays etranger",
    "kunyomiExampleJp": "国",
    "kunyomiExampleReading": "くに",
    "kunyomiExampleFr": "pays"
  },
  {
    "id": "生",
    "kanji": "生",
    "meaningsFr": [
      "vie",
      "naissance",
      "cru"
    ],
    "onyomi": "セイ",
    "kunyomi": "いきる",
    "onyomiExampleJp": "学生",
    "onyomiExampleReading": "がくせい",
    "onyomiExampleFr": "etudiant",
    "kunyomiExampleJp": "生きる",
    "kunyomiExampleReading": "いきる",
    "kunyomiExampleFr": "vivre"
  },
  {
    "id": "山",
    "kanji": "山",
    "meaningsFr": ["montagne"],
    "onyomi": "サン",
    "kunyomi": "やま",
    "onyomiExampleJp": "富士山",
    "onyomiExampleReading": "ふじさん",
    "onyomiExampleFr": "mont Fuji",
    "kunyomiExampleJp": "山",
    "kunyomiExampleReading": "やま",
    "kunyomiExampleFr": "montagne"
  },
  {
    "id": "左",
    "kanji": "左",
    "meaningsFr": ["gauche"],
    "onyomi": "サ",
    "kunyomi": "ひだり",
    "onyomiExampleJp": "左折",
    "onyomiExampleReading": "させつ",
    "onyomiExampleFr": "tourner a gauche",
    "kunyomiExampleJp": "左",
    "kunyomiExampleReading": "ひだり",
    "kunyomiExampleFr": "gauche"
  },
  {
    "id": "三",
    "kanji": "三",
    "meaningsFr": ["trois"],
    "onyomi": "サン",
    "kunyomi": "みっつ",
    "onyomiExampleJp": "三月",
    "onyomiExampleReading": "さんがつ",
    "onyomiExampleFr": "mars",
    "kunyomiExampleJp": "三つ",
    "kunyomiExampleReading": "みっつ",
    "kunyomiExampleFr": "trois objets"
  },
  {
    "id": "西",
    "kanji": "西",
    "meaningsFr": ["ouest"],
    "onyomi": "サイ",
    "kunyomi": "にし",
    "onyomiExampleJp": "関西",
    "onyomiExampleReading": "かんさい",
    "onyomiExampleFr": "region du Kansai",
    "kunyomiExampleJp": "西",
    "kunyomiExampleReading": "にし",
    "kunyomiExampleFr": "ouest"
  },
  {
    "id": "十",
    "kanji": "十",
    "meaningsFr": ["dix"],
    "onyomi": "ジュウ",
    "kunyomi": "とお",
    "onyomiExampleJp": "十分",
    "onyomiExampleReading": "じゅうぶん",
    "onyomiExampleFr": "suffisant",
    "kunyomiExampleJp": "十",
    "kunyomiExampleReading": "とお",
    "kunyomiExampleFr": "dix"
  },
  {
    "id": "七",
    "kanji": "七",
    "meaningsFr": ["sept"],
    "onyomi": "シチ",
    "kunyomi": "ななつ",
    "onyomiExampleJp": "七時",
    "onyomiExampleReading": "しちじ",
    "onyomiExampleFr": "sept heures",
    "kunyomiExampleJp": "七つ",
    "kunyomiExampleReading": "ななつ",
    "kunyomiExampleFr": "sept objets"
  },
  {
    "id": "千",
    "kanji": "千",
    "meaningsFr": ["mille"],
    "onyomi": "セン",
    "kunyomi": "",
    "onyomiExampleJp": "千円",
    "onyomiExampleReading": "せんえん",
    "onyomiExampleFr": "mille yens"
  },
  {
    "id": "天",
    "kanji": "天",
    "meaningsFr": ["ciel"],
    "onyomi": "テン",
    "kunyomi": "",
    "onyomiExampleJp": "天気",
    "onyomiExampleReading": "てんき",
    "onyomiExampleFr": "temps, meteo"
  },
  {
    "id": "土",
    "kanji": "土",
    "meaningsFr": [
      "terre",
      "sol"
    ],
    "onyomi": "ド",
    "kunyomi": "つち",
    "onyomiExampleJp": "土曜日",
    "onyomiExampleReading": "どようび",
    "onyomiExampleFr": "samedi",
    "kunyomiExampleJp": "土",
    "kunyomiExampleReading": "つち",
    "kunyomiExampleFr": "terre"
  },
  {
    "id": "話",
    "kanji": "話",
    "meaningsFr": [
      "parler",
      "histoire"
    ],
    "onyomi": "ワ",
    "kunyomi": "はなす",
    "onyomiExampleJp": "電話",
    "onyomiExampleReading": "でんわ",
    "onyomiExampleFr": "telephone",
    "kunyomiExampleJp": "話す",
    "kunyomiExampleReading": "はなす",
    "kunyomiExampleFr": "parler"
  },
  {
    "id": "時",
    "kanji": "時",
    "meaningsFr": [
      "heure",
      "moment"
    ],
    "onyomi": "ジ",
    "kunyomi": "とき",
    "onyomiExampleJp": "時間",
    "onyomiExampleReading": "じかん",
    "onyomiExampleFr": "temps",
    "kunyomiExampleJp": "時",
    "kunyomiExampleReading": "とき",
    "kunyomiExampleFr": "moment"
  },
  {
    "id": "書",
    "kanji": "書",
    "meaningsFr": ["ecrire"],
    "onyomi": "ショ",
    "kunyomi": "かく",
    "onyomiExampleJp": "辞書",
    "onyomiExampleReading": "じしょ",
    "onyomiExampleFr": "dictionnaire",
    "kunyomiExampleJp": "書く",
    "kunyomiExampleReading": "かく",
    "kunyomiExampleFr": "ecrire"
  },
  {
    "id": "食",
    "kanji": "食",
    "meaningsFr": [
      "manger",
      "nourriture"
    ],
    "onyomi": "ショク",
    "kunyomi": "たべる",
    "onyomiExampleJp": "食堂",
    "onyomiExampleReading": "しょくどう",
    "onyomiExampleFr": "cantine",
    "kunyomiExampleJp": "食べる",
    "kunyomiExampleReading": "たべる",
    "kunyomiExampleFr": "manger"
  },
  {
    "id": "上",
    "kanji": "上",
    "meaningsFr": [
      "haut",
      "dessus"
    ],
    "onyomi": "ジョウ",
    "kunyomi": "うえ",
    "onyomiExampleJp": "上手",
    "onyomiExampleReading": "じょうず",
    "onyomiExampleFr": "habile",
    "kunyomiExampleJp": "上",
    "kunyomiExampleReading": "うえ",
    "kunyomiExampleFr": "au-dessus"
  },
  {
    "id": "水",
    "kanji": "水",
    "meaningsFr": ["eau"],
    "onyomi": "スイ",
    "kunyomi": "みず",
    "onyomiExampleJp": "水曜日",
    "onyomiExampleReading": "すいようび",
    "onyomiExampleFr": "mercredi",
    "kunyomiExampleJp": "水",
    "kunyomiExampleReading": "みず",
    "kunyomiExampleFr": "eau"
  },
  {
    "id": "先",
    "kanji": "先",
    "meaningsFr": [
      "avant",
      "precedent"
    ],
    "onyomi": "セン",
    "kunyomi": "さき",
    "onyomiExampleJp": "先生",
    "onyomiExampleReading": "せんせい",
    "onyomiExampleFr": "professeur",
    "kunyomiExampleJp": "先",
    "kunyomiExampleReading": "さき",
    "kunyomiExampleFr": "avant"
  },
  {
    "id": "前",
    "kanji": "前",
    "meaningsFr": [
      "avant",
      "devant"
    ],
    "onyomi": "ゼン",
    "kunyomi": "まえ",
    "onyomiExampleJp": "午前",
    "onyomiExampleReading": "ごぜん",
    "onyomiExampleFr": "matin",
    "kunyomiExampleJp": "前",
    "kunyomiExampleReading": "まえ",
    "kunyomiExampleFr": "devant"
  },
  {
    "id": "小",
    "kanji": "小",
    "meaningsFr": ["petit"],
    "onyomi": "ショウ",
    "kunyomi": "ちいさい",
    "onyomiExampleJp": "小学校",
    "onyomiExampleReading": "しょうがっこう",
    "onyomiExampleFr": "école primaire",
    "kunyomiExampleJp": "小さい",
    "kunyomiExampleReading": "ちいさい",
    "kunyomiExampleFr": "petit"
  },
  {
    "id": "中",
    "kanji": "中",
    "meaningsFr": [
      "milieu",
      "interieur"
    ],
    "onyomi": "チュウ",
    "kunyomi": "なか",
    "onyomiExampleJp": "中国",
    "onyomiExampleReading": "ちゅうごく",
    "onyomiExampleFr": "Chine",
    "kunyomiExampleJp": "中",
    "kunyomiExampleReading": "なか",
    "kunyomiExampleFr": "interieur"
  },
  {
    "id": "長",
    "kanji": "長",
    "meaningsFr": [
      "longtemps",
      "chef"
    ],
    "onyomi": "チョウ",
    "kunyomi": "ながい",
    "onyomiExampleJp": "校長",
    "onyomiExampleReading": "こうちょう",
    "onyomiExampleFr": "directeur d'école",
    "kunyomiExampleJp": "長い",
    "kunyomiExampleReading": "ながい",
    "kunyomiExampleFr": "long"
  },
  {
    "id": "四",
    "kanji": "四",
    "meaningsFr": ["quatre"],
    "onyomi": "シ",
    "kunyomi": "よん / よっつ",
    "onyomiExampleJp": "四月",
    "onyomiExampleReading": "しがつ",
    "onyomiExampleFr": "avril",
    "kunyomiExamples": [
      {
        "kana": "よん",
        "jp": "四人",
        "reading": "よにん",
        "fr": "quatre personnes"
      },
      {
        "kana": "よっつ",
        "jp": "四つ",
        "reading": "よっつ",
        "fr": "quatre objets"
      }
    ]
  },
  {
    "id": "子",
    "kanji": "子",
    "meaningsFr": ["enfant"],
    "onyomi": "",
    "kunyomi": "こ",
    "kunyomiExampleJp": "子ども",
    "kunyomiExampleReading": "こども",
    "kunyomiExampleFr": "enfant"
  },
  {
    "id": "聞",
    "kanji": "聞",
    "meaningsFr": [
      "entendre",
      "écouter",
      "demander"
    ],
    "onyomi": "ブン",
    "kunyomi": "きく",
    "onyomiExampleJp": "新聞",
    "onyomiExampleReading": "しんぶん",
    "onyomiExampleFr": "journal",
    "kunyomiExampleJp": "聞く",
    "kunyomiExampleReading": "きく",
    "kunyomiExampleFr": "ecouter"
  },
  {
    "id": "万",
    "kanji": "万",
    "meaningsFr": ["dix mille"],
    "onyomi": "マン",
    "kunyomi": "",
    "onyomiExampleJp": "一万円",
    "onyomiExampleReading": "いちまんえん",
    "onyomiExampleFr": "dix mille yens"
  },
  {
    "id": "円",
    "kanji": "円",
    "meaningsFr": [
      "cercle",
      "yen"
    ],
    "onyomi": "エン",
    "kunyomi": "",
    "onyomiExampleJp": "百円",
    "onyomiExampleReading": "ひゃくえん",
    "onyomiExampleFr": "cent yens"
  },
  {
    "id": "雨",
    "kanji": "雨",
    "meaningsFr": ["pluie"],
    "onyomi": "",
    "kunyomi": "あめ",
    "kunyomiExampleJp": "雨の日",
    "kunyomiExampleReading": "あめのひ",
    "kunyomiExampleFr": "jour de pluie"
  },
  {
    "id": "車",
    "kanji": "車",
    "meaningsFr": [
      "voiture",
      "véhicule"
    ],
    "onyomi": "シャ",
    "kunyomi": "くるま",
    "onyomiExampleJp": "電車",
    "onyomiExampleReading": "でんしゃ",
    "onyomiExampleFr": "train",
    "kunyomiExampleJp": "車",
    "kunyomiExampleReading": "くるま",
    "kunyomiExampleFr": "voiture"
  },
  {
    "id": "出",
    "kanji": "出",
    "meaningsFr": [
      "sortir",
      "faire sortir"
    ],
    "onyomi": "シュツ",
    "kunyomi": "でる",
    "onyomiExampleJp": "出口",
    "onyomiExampleReading": "でぐち",
    "onyomiExampleFr": "sortie",
    "kunyomiExampleJp": "出る",
    "kunyomiExampleReading": "でる",
    "kunyomiExampleFr": "sortir"
  },
  {
    "id": "川",
    "kanji": "川",
    "meaningsFr": ["rivière"],
    "onyomi": "",
    "kunyomi": "かわ",
    "kunyomiExampleJp": "川",
    "kunyomiExampleReading": "かわ",
    "kunyomiExampleFr": "rivière"
  }
];

export const n5Cards = Object.freeze(
  rawN5Cards.map((card) =>
    createKanjiCard({
      ...card,
      jlptLevel: 5,
      tags: ["n5"],
    })
  )
);

export const n5Deck = createDeck({
  id: "jlpt-n5",
  level: 5,
  label: "N5",
  description: "Jeu JLPT N5 complet pour le MVP de cartes memoire.",
  cards: n5Cards,
  note: `${n5Cards.length} kanjis`,
});

export const n5CardsById = n5Deck.cardsById;
