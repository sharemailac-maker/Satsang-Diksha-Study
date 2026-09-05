var vachtopics = new Array("T01_1", "T02_1", "T03_1", "T03_2", "T04_1", "T05_1", "T06_1", "T06_2", "T06_3", "T06_4", "T06_5", "T07_1", "T07_2", "T07_3", "T08_1", "T08_2", "T08_3", "T08_4", "T08_5", "T08_6", "T08_7", "T08_8", "T08_9", "T08_10", "T09_1", "T09_2", "T10_1", "T10_2", "T10_3", "T11_1", "T11_2", "T11_3", "T12_1", "T12_2", "T12_3", "T12_4", "T12_5", "T12_6", "T12_7", "T12_8", "T12_9", "T12_10", "T12_11", "T12_12", "T12_13", "T12_14", "T13_1", "T13_2", "T14_1", "T14_2", "T14_3", "T14_4", "T14_5", "T14_6", "T14_7", "T14_8", "T14_9", "T14_10", "T14_11", "T14_12", "T14_13", "T14_14", "T14_15", "T14_16", "T14_17", "T14_18", "T14_19", "T14_20", "T14_21", "T15_1", "T15_2", "T15_3", "T16_1", "T16_2", "T16_3", "T17_1", "T18_1", "T19_1", "T20_1", "T21_1", "T22_1", "T23_1", "T24_1", "T24_2", "T24_3", "T24_4", "T25_1", "T26_1", "T27_1", "T28_1", "T29_1", "T30_1", "T30_2", "T30_3", "T30_4", "T30_5", "T30_6");

function topics_arr(top) {
switch(top) {
case "T01_1":
 return ["Form of Jiva [Jivanu Swarup]", "", "", "", "GI-7", "GI-38", "GI-78", "Sar-5", "Kar-1", "Kar-4", "Kar-12", "Loya-15", "GII-66", "Var-6", "GIII-4", "GIII-10", "GIII-22", "GIII-39", "Add-8"];
case "T02_1":
 return ["Form of Ishwar [Ishwarnu Swarup]", "", "", "", "GI-7", "GI-12", "Sar-5", "Kar-1", "GII-10", "GII-31", "Amd-2", "GIII-10"];
case "T03_1":
 return ["Māyā", "Form of māyā", "", "", "GI-1", "GI-7", "GI-12", "GI-34", "Sar-14", "Sar-17", "Kar-12", "Loya-10", "Pan-3", "GII-36", "GII-45", "GII-65", "GIII-10", "GIII-39"];
case "T03_2":
 return ["", "Methods of eradicating māyā", "", "", "GI-37", "GI-63", "Kar-8", "Kar-12", "Loya-4", "Loya-10", "Pan-7", "GII-32", "Var-5", "Add-7"];
case "T04_1":
 return ["Deeds of Previous Births - Good and Bad [Purva Sanskār - Shubh-Ashubh]", "", "", "", "GI-11", "GI-13", "GI-24", "GI-29", "GI-55", "GI-58", "Sar-9", "Loya-8", "GII-27", "GII-29", "GII-35", "GII-36", "GII-44", "GII-45", "GI-59", "Var-6", "GIII-2", "GIII-13", "GIII-18", "GIII-20"];
case "T05_1":
 return ["Eight Factors of Influence - Good and Bad [Desh-kālādik Āth - Shubh-Ashubh]", "", "", "", "GI-2", "GI-29", "GI-55", "GI-59", "GI-77", "GI-78", "Loya-6", "Loya-10", "Loya-12", "Loya-13", "Loya-17", "GII-9", "GII-21", "GII-27", "GII-32", "GII-39", "GII-44", "GII-45", "GI-51", "GII-56", "Var-20", "GIII-21", "GIII-11", "GIII-14", "GIII-20", "GIII-24", "GIII-37"];
case "T06_1":
 return ["Indriya-Antahkaran [Senses and Inner Faculties]", "Genesis and form of", "", "", "GI-12", "GI-18", "GI-32", "Kar-12", "Loya-15", "Pan-3", "GII-2", "GII-47", "Var-5"];
case "T06_2":
 return ["", "Mind [Man]", "", "", "GI-12", "GI-38", "Sar-1", "Sar-7", "Loya-14", "GII-23", "Var-1", "GIII-6"];
case "T06_3":
 return ["", "Intellect [Buddhi]", "", "", "GI-12", "GI-35", "GI-50", "GI-70", "Kar-1", "Kar-2", "Kar-4", "Pan-1", "Pan-3", "GII-9", "GII-11", "GII-14", "GII-26", "GII-44", "GII-52", "Amd-3", "GIII-14", "GIII-34"];
case "T06_4":
 return ["", "Mind/consciousness [Chitta]", "", "", "GI-12", "GI-25", "GII-6"];
case "T06_5":
 return ["", "Methods of conquering", "", "", "GI-8", "GI-18", "GI-38", "GI-38", "GI-70", "GI-73", "Sar-1", "Sar-7", "Kar-3", "Loya-5", "Loya-8", "Pan-3", "GII-2", "GII-8", "GII-16", "GII-33", "GIII-8", "GIII-11", "GIII-32"];
case "T07_1":
 return ["Attachments and Weakness for Indulgences [Vāsanā/Panch-vishaymā Āsakti]", "What is vāsanā?", "", "", "GI-11", "GIII-18", "GIII-20"];
case "T07_2":
 return ["", "Necessity of eradicating vāsanā", "", "", "GI-21", "GI-26", "GI-38", "GI-60", "Sar-4", "Sar-11", "GII-45", "GII-50", "Amd-3", "GIII-18", "Add-9"];
case "T07_3":
 return ["", "Methods of eradicating vāsanā", "", "", "GI-21", "GI-24", "GI-38", "GI-58", "GI-60", "GI-73", "Sar-1", "Sar-5", "Loya-10", "Loya-16", "Loya-17", "Pan-1", "GII-1", "GII-2", "GII-13", "GII-16", "GII-22", "GII-25", "GII-33", "GII-47", "Amd-3", "GIII-14", "GIII-18", "GIII-20", "GIII-34", "GIII-39", "Add-9"];

case "T08_1":
 return ["Internal Vices [Antar-shatruo]", "", "", "", "GI-24", "GI-35", "GI-48", "GI-58", "GI-61", "GI-68", "GI-76", "GI-78", "Loya-14", "GII-13", "GII-40", "GIII-21", "GIII-27", "GIII-28"];
case "T08_2":
 return ["", "Impure nature [malin swabhāv/prakruti]", "", "", "GI-1", "GI-57", "Sar-18", "Loya-8", "GII-7", "GII-15", "GII-37", "GIII-20", "GIII-24", "GIII-27", "GIII-35"];
case "T08_3":
 return ["", "Lust [Kām]", "", "", "GI-73", "GI-76", "Kar-3", "Loya-1", "Loya-6", "Loya-8", "Loya-10", "GII-33", "GII-38", "GII-39", "GII-47", "GIII-19", "GIII-38", "Jetalpur 2"];
case "T08_4":
 return ["", "Anger [Krodh]", "", "", "GI-69", "Loya-1", "Loya-14", "GII-1", "GII-27", "GIII-1", "GIII-14", "GIII-34", "Amd-8"];
case "T08_5":
 return ["", "Greed [Lobh]", "", "", "GI-27", "GI-36", "Loya-17", "GII-4", "GIII-28", "GIII-38"];
case "T08_6":
 return ["", "Infatuation [Moh]", "", "", "Sar-14", "Pan-7", "GII-1", "GII-53", "Var-20"];
case "T08_7":
 return ["", "Ego/Arrogance [Mad/Mān/Dehābhimān]", "", "", "GI-6", "GI-35", "GI-44", "GI-56", "GI-62", "GI-72", "Sar-8", "Loya-6", "Loya-14", "Loya-16", "Loya-17", "Pan-3", "Pan-5", "GII-25", "GII-32", "GII-41", "Var-11", "Amd-3", "GIII-12", "GIII-25", "GIII-26", "GIII-27", "GIII-28", "GIII-38", "Amd-7", "Jetalpur 3"];
case "T08_8":
 return ["", "Jealousy/Envy [Matsar/Irshyā/Asuyā]", "", "", "GI-4", "GI-71", "GI-72", "Sar-8", "Kar-6", "GII-28", "GII-47", "GII-52", "GIII-1", "GIII-6"];
case "T08_9":
 return ["", "Deceitfulness/Hypocrisy [Kapat/Dambh]", "", "", "GI-76", "Kar-3", "Loya-5", "Loya-16", "GII-39", "Var-5", "GIII-24", "GIII-25", "GIII-26", "GIII-30"];
case "T08_10":
 return ["", "Love for wordly objects [Jagat sambandhi sneh]", "", "", "GI-21", "GI-26", "GI-34", "GI-37", "GI-44", "Sar-1", "Sar-15", "Pan-3", "GII-32", "GII-36", "Var-19", "GIII-2", "GIII-3", "GIII-9", "GIII-12", "GIII-17", "GIII-19", "GIII-38"];

case "T09_1":
 return ["Purpose of God’s Manifestation", "", "", "", "Kar-5", "GII-19", "GII-46", "GIII-21", "Jetalpur 5"];
case "T09_2":
 return ["", "God becomes like a man for the salvation of the jiva", "", "", "GI-51", "GI-63", "GI-64", "GI-71", "GI-72", "GI-78", "Kar-1", "Kar-7", "Pan-4", "Pan-7", "GII-65", "GIII-37", "GIII-38"];

case "T10_1":
 return ["Conviction/Faith/Refuge/Upāsanā [Nishchay/Nishthā/Āsharo/Upāsanā]", "Importance of", "", "", "GI-31", "GI-33", "GI-37", "GI-56", "GI-57", "GI-61", "GI-62", "GI-63", "GI-72", "Kar-7", "Loya-6", "Loya-7", "Loya-10", "Loya-18", "Pan-7", "GII-9", "GII-10", "GII-13", "GII-14", "GII-16", "GII-17", "GII-35", "GII-61", "GII-66", "Var-1", "Var-10", "Var-12", "Var-14", "GIII-7", "GIII-13", "GIII-36", "GIII-37", "Ashlali", "Jetalpur 1"];
case "T10_2":
 return ["", "Characteristics of", "", "", "GI-63", "GI-68", "GI-72", "GI-75", "GI-78", "Sar-13", "Kar-1", "Loya-1", "Loya-3", "Loya-12", "Pan-4", "GII-59", "GII-66", "Var-5", "Var-12", "GIII-35"];
case "T10_3":
 return ["", "Cultivation of", "", "", "GI-51", "GI-70", "Sar-13", "Kar-12", "Loya-6", "Loya-12", "Pan-7", "GII-13", "Var-20", "GIII-27", "GIII-28", "Amd-6", "Amd-7", "Ashlali"];

case "T11_1":
 return ["Knowledge of God’s Greatness [Māhātmya-gnān]", "Necessity of understanding God’s greatness", "", "", "GI-1", "GI-24", "GI-25", "GI-57", "GI-60", "GI-73", "Sar-5", "Sar-15", "Sar-17", "Kar-9", "Loya-1", "Loya-5", "Loya-8", "Loya-10", "Loya-16", "Loya-17", "Pan-1", "GII-4", "GII-12", "GII-16", "Var-3", "Amd-5", "GIII-5", "GIII-11", "GIII-27", "GIII-28", "GIII-39"];

case "T11_2":
 return ["", "Contemplating on the God’s greatness [Māhātmyano vichār]", "Extraordinary powers [Asādhāran aishwarya/pratāp]", "", "GI-56", "GI-59", "GI-62", "GI-64", "GI-78", "Sar-9", "Loya-3", "Pan-4", "GII-4", "GII-53", "GII-67", "G-III-32", "GIII-37", "GIII-39"];
case "T11_3":
 return ["", "", "Bliss of God [Bhagwānnu sukh]", "", "Sar-1", "Loya-17", "Loya-18", "Pan-1", "Pan-3", "GII-1", "GII-10", "GII-57", "Var-9", "Var-16", "GIII-27", "GIII-28", "GIII-39"];

case "T12_1":
 return ["Upāsanā", "All-doer [Sarva Kartā-Hartā]", "All-controller [Kartā-Niyantā]", "", "GI-27", "GI-37", "GI-41", "GI-56", "GI-59", "GI-62", "GI-63", "GI-74", "GI-78", "Kar-10", "Loya-1", "Loya-2", "Pan-1", "Pan-7", "GII-21", "GII-31", "Var-2", "GIII-13", "GIII-35", "GIII-38", "GIII-39", "Amd-7", "Jetalpur 5"];
case "T12_2":
 return ["", "", "Omniscient/Omnipresent/Bestower of fruits of one’s deeds [Antaryāmi/Sarvagna/Karma-fal-pradātā]", "", "GI-13", "GI-45", "GI-62", "GI-65", "GI-78", "GII-21", "GII-27", "GII-62", "Var-6", "GIII-37"];
case "T12_3":
 return ["", "With form [Sākār]", "", "", "GI-37", "GI-40", "GI-45", "GI-64", "GI-66", "GI-71", "Kar-4", "Kar-7", "Loya-14", "Loya-15", "Loya-16", "Loya-18", "Pan-1", "Pan-7", "GII-9", "GII-10", "GII-13", "GII-39", "GII-64", "Var-2", "Var-13", "GIII-7", "GIII-30", "GIII-32", "GIII-35", "GIII-36", "GIII-38"];
case "T12_4":
 return ["", "Seeing divinity [Divyabhāv]", "What is divyabhāv?", "", "GI-63", "GI-71", "GI-72", "Kar-7", "Loya-18", "Pan-4", "Pan-7", "GII-4", "GII-10", "GII-13", "GII-17", "GII-65", "Var-7", "GIII-1", "GIII-2", "GIII-21", "GIII-31", "Amd-4"];
case "T12_5":
 return ["", "", "Benefits of divyabhāv", "", "GI-24", "GI-58", "GI-67", "GI-73", "Sar-18", "Loya-4", "Loya-18", "Pan-7", "GII-33", "GII-53", "Var-5"];
case "T12_6":
 return ["", "Sarvopari", "", "", "GI-31", "GI-59", "Sar-1", "Loya-7", "Loya 14", "Pan-1", "Pan-6", "GII-9", "GII-13", "GIII-31", "GIII-36", "GIII-38", "Amd-6", "Amd-7"];
case "T12_7":
 return ["", "Unparalleled relationship between Swāmi and Sevak", "", "", "GI-64", "Kar-8", "Kar-10", "Loya-4", "Loya-13", "Pan-2", "GII-3", "GII-67", "GIII-37", "GIII-39"];
case "T12_8":
 return ["", "Ever-present [Pragat]", "Shriji Mahārāj - Ever-present God [Shriji Mahārāj pragat Bhagwān]", "", "GI-3", "GI-27", "GI-31", "GI-37", "GI-38", "GI-49", "GI-56", "Kar-2", "Kar-8", "Pan-6", "Pan-7", "GII-13", "GII-35", "GIII-28", "GIII-31", "GIII-35", "GIII-38", "Amd-6", "Amd-7"];
case "T12_9":
 return ["", "", "Necessity of pragat Bhagwān or Sant", "", "GI-27", "Loya-7", "GII-21", "GII-32", "GII-59", "Var-10", "Var-19", "GIII-2", "GIII-7", "GIII-36", "Jetalpur 1"];
case "T12_10":
 return ["", "Shriji Mahārāj’s personality in His own words", "", "", "GI-10", "GI-18", "GI-26", "GI-29", "GI-37", "GI-44", "GI-68", "GI-70", "GI-73", "Sar-2", "Kar-3", "Kar-6", "Kar-10", "Loya-3", "Loya-14", "Pan-1", "GII-1", "GII-13", "GII-19", "GII-22", "GII-27", "GII-28", "GII-30", "GII-33", "GII-35", "GII-39", "GII-40", "GII-45", "GII-47", "GII-48", "GII-49", "GII-50", "GII-55", "GII-56", "GII-60", "GII-62", "GII-63", "Var-11", "Var-16", "Var-18", "GIII-2", "GIII-13", "GIII-14", "GIII-21", "GIII-24", "GIII-25", "GIII-27", "GIII-30", "GIII-39", "Jetalpur 3", "Jetalpur 5"];
case "T12_11":
 return ["", "Aksharbrahma", "Necessity of Aksharbrahma", "To recognize Parabrahma", "GI-41", "GI-63", "GII-3", "GII-42"];
case "T12_12":
 return ["", "", "", "To become brahmarup", "GII-20", "GII-31"];
case "T12_13":
 return ["", "", "", "Why become brahmarup?", "Loya-7", "Loya-12", "GII-30", "Amd-2", "Sar-12", "GII-3", "GII-8", "GII-62"];
case "T12_14":
 return ["", "", "Form and greatness of Aksharbrahma", "", "GI-7", "GI-21", "GI-46", "GI-63", "GI-71", "Sar-5", "Loya-13", "Loya-17", "Pan-1", "GII-20", "GII-42", "Amd-6"];

case "T13_1":
 return ["Āgnā", "", "", "", "GI-15", "GI-31", "GI-63", "GI-73", "GI-78", "Sar-18", "Kar-11", "Kar-12", "Loya-3", "Loya-4", "Loya-6", "GII-7", "GII-19", "GII-51", "GIII-18", "GIII-27"];
case "T13_2":
 return ["", "Āgnās explicitely given by Mahārāj", "", "", "GI-17", "GI-18", "GI-48", "Sar-4", "Loya-18", "Pan-3", "GII-8", "GII-13", "GII-21", "GII-31", "GII-35", "GII-40", "GII-45", "GII-47", "GII-49", "GII-61", "Var-11", "GIII-1", "GIII-19", "GIII-39", "Amd-4", "Jetalpur 1", "Jetalpur 3", "Jetalpur 5"];

case "T14_1":
 return ["Ekāntik Dharma/Ekāntik Bhakta", "Dharma, Gnān, Bhakti, Vairāgya", "", "", "GI-19", "GI-21", "GI-27", "GI-29", "GI-36", "GI-44", "GI-47", "GI-54", "GI-75", "Sar-18", "Loya-1", "Loya-6", "Loya-9", "Loya-16", "Loya-17", "Pan-3", "GII-15", "GII-19", "GII-22", "GII-26", "GII-32", "GII-38", "GII-45", "GII-65", "GII-66", "Var-3", "GIII-13", "GIII-21", "GIII-33"];
case "T14_2":
 return ["", "Conviction of God is ekāntikpanu", "", "", "GI-66", "Pan-7", "GII-9", "GII-14", "GII-17", "Var-1", "Ashlali"];
case "T14_3":
 return ["", "Detachment from the world is ekāntikpanu", "", "", "GI-1", "GI-38", "GI-43", "GI-60", "Sar-11", "GII-1"];
case "T14_4":
 return ["", "Attachment to God is ekāntikpanu", "", "", "GII-48", "GII-55"];
case "T14_5":
 return ["", "", "Elements of Ekāntik Dharma", "Swadharma-niyam", "GI-8", "GI-18", "GI-25", "GI-34", "GI-42", "GI-54", "GI-77", "GI-78", "Sar-9", "Kar-7", "Loya-1", "Loya-5", "Loya-6", "Pan-3", "GII-2", "GII-4", "GII-6", "GII-9", "GII-13", "GII-16", "GII-33", "GII-35", "GII-39", "GII-51", "GII-61", "GII-62", "Var-10", "Var-17", "Var-18", "GIII-8", "GIII-11", "GIII-14", "GIII-24", "GIII-26", "GIII-27", "GIII-29", "GIII-32", "GIII-33", "GIII-34", "GIII-38", "Jetalpur 3", "Jetalpur 4", "Jetalpur 5"];
case "T14_6":
 return ["", "", "", "Penance [Tap/Deh-daman]", "GI-38", "Sar-2", "Kar-3", "Kar-10", "Loya-1", "Loya-5", "Loya-8", "Loya-14", "GII-8", "GII-33", "GIII-11", "GIII-24", "GIII-32"];
case "T14_7":
 return ["", "", "Ātmā-realization [Ātmanishthā]", "Importance of", "GI-19", "GI-21", "GI-23", "GI-25", "GI-32", "GI-37", "GI-44", "GI-60", "GI-61", "GI-73", "Sar-1", "Sar-4", "Sar-9", "Sar-14", "Sar-15", "Kar-3", "Loya-1", "Loya-2", "Loya-5", "Loya-6", "Loya-8", "Loya-10", "Loya-17", "GII-1", "GII-2", "GII-6", "GII-30", "GII-32", "GII-33", "GII-35", "GII-45", "GII-51", "GII-57", "GII-60", "GII-62", "GII-63", "Var-11", "Var-20", "Amd-3", "GIII-1", "GIII-3", "GIII-19", "GIII-20", "GIII-21", "GIII-24", "GIII-26", "GIII-33", "GIII-39"];
case "T14_8":
 return ["", "", "", "Ātmā-realization as less important [Ātmānishthāni gaunatā]", "GI-61", "Kar-1", "GII-26", "GII-63", "GII-65", "GII-66", "GIII-5", "Ashlali"];
case "T14_9":
 return ["", "", "", "Develop firm ātmanishthā with upāsanā/bhakti", "GI-56", "Sar-15", "GII-35", "GIII-22", "GIII-36"];
case "T14_10":
 return ["", "", "", "Develop firm ātmanishthā with ātmavichār", "GI-20", "Sar-1", "Sar-4", "Sar-12", "Loya-10", "Loya-17", "Pan-3", "GII-2", "GII-12", "GII-62", "GII-63", "GIII-39"];
case "T14_11":
 return ["", "", "", "Develop firm ātmanishtha through Satpurush", "GI-16", "Loya-10", "GII-51", "GII-66", "Var-11", "Jetalpur 1"];
case "T14_12":
 return ["", "", "Detachment [Vairāgya]", "Importance of vairāgya", "GI-19", "GI-34", "GI-60", "Sar-11", "Sar-15", "Kar-7", "Loya-17", "GII-7", "GII-30", "GII-60", "GIII-1", "GIII-3", "GIII-8", "GIII-11", "GIII-24", "GIII-29", "GIII-33", "GIII-34"];
case "T14_13":
 return ["", "", "", "Characteristics of vairāgya", "GI-2", "GI-26", "GI-44", "GI-47", "Loya-1", "GIII-30"];
case "T14_14":
 return ["", "", "", "Develop firm vairāgya through contemplation", "GI-12", "Sar-2", "Loya-9", "Loya-10", "Pan-1", "GII-1", "GII-10", "GII-24", "GII-47", "Var-17", "Var-19", "GIII-14"];
case "T14_15":
 return ["", "", "", "Develop firm vairāgya with knowledge of Ātmā-Parmāmtmā", "GI-56", "GI-73", "Sar-1", "Loya-10", "GIII-24", "GIII-39"];
case "T14_16":
 return ["", "", "", "Develop firm vairāgya through scriptures and satpurush", "GI-8", "Sar-7", "Sar-11", "Sar-18", "Kar-7", "GIII-29"];
case "T14_17":
 return ["", "", "", "Develop firm vairāgya through experience [anubhav]", "GII-16", "GII-25"];
case "T14_18":
 return ["", "", "Devotion [Bhakti]", "Importance of bhakti", "GI-19", "GI-37", "GI-56", "GI-61", "Sar-5", "Loya-7", "Loya-16", "GII-10", "GII-26", "GII-27", "GII-28", "GII-32", "GII-33", "GII-62", "GII-65", "GII-66", "Var-3", "GIII-11", "GIII-15", "GIII-20", "GIII-22", "GIII-24", "GIII-30", "GIII-32", "GIII-34", "Jetalpur 5"];
case "T14_19":
 return ["", "", "", "Characteristics of one with bhakti", "GI-5", "GI-15", "GI-26", "GI-31", "GI-37", "GI-40", "GI-47", "GI-76", "Kar-10", "GII-10", "GII-11", "GII-19", "Var-17", "Jetalpur 3"];
case "T14_20":
 return ["", "", "", "Characterstics of bhakti - divine actions [Leelā-charitro]", "GI-3", "GI-38", "GII-35", "GII-58"];
case "T14_21":
 return ["", "", "", "Unhindered devotion [Nirvighna bhakti]", "GI-19", "GI-23", "GI-78", "Sar-1", "Sar-5", "Sar-15", "GII-3", "GII-32", "GII-43", "GII-52", "GII-57", "GII-65", "GIII-1", "GIII-5", "GIII-6", "GIII-8", "GIII-9", "GIII-19", "GIII-20", "GIII-21", "GIII-28", "GIII-33", "GIII-36"];

case "T15_1":
 return ["Love/Devotion/Affection toward God [Priti/Het/Bhakti/Sneh]", "Importance of affection", "", "", "GI-33", "Sar-11", "Sar-15", "Loya-2", "GII-9", "GII-36", "GII-59", "GII-63", "Var-11", "GIII-8", "GIII-11", "GIII-29", "GIII-34", "Jetalpur 1"];
case "T15_2":
 return ["", "Characteristics of one with fidelity [Pativratāni Tek]", "", "", "GI-26", "GI-36", "GI-44", "GI-57", "Kar-11", "Loya-2", "Loya-4", "Loya-11", "Loya-14", "Pan-13", "GII-1", "GII-5", "GII-38", "GII-43", "GII-50", "GII-54", "GII-56", "GII-57", "GII-59", "GII-62", "Var-19", "GIII-1", "GIII-7", "GIII-13", "GIII-16"];
case "T15_3":
 return ["", "How to cultivate affection?", "", "", "GI-1", "GI-8", "GI-44", "GI-59", "Sar-2", "Loya-10", "GII-10", "GIII-3", "GIII-14", "GIII-23"];

case "T16_1":
 return ["Continuous Contemplation [Akhand-vrutti/Akhand-smruti]", "Importance of continuous contemplation", "", "", "GI-1", "GI-22", "GI-23", "GI-24", "GI-25", "Sar-11", "GII-48", "GII-49", "Amd-3", "Jetalpur 4"];
case "T16_2":
 return ["", "Difficulty of continuous contemplation", "", "", "GI-1", "GI-49", "Kar-7", "GII-4", "GII-36"];
case "T16_3":
 return ["", "How to cultivate continuous contemplation?", "", "", "GI-21", "GI-22", "GI-23", "GI-25", "GI-26", "GI-32", "GI-34", "GI-49", "GI-78", "Kar-7", "GII-36", "GII-49"];

case "T17_1":
 return ["Meditation [Dhyān]", "", "", "", "GI-5", "GI-15", "GI-32", "Sar-9", "Sar-12", "Kar-1", "Kar-12", "Loya-5", "Loya-10", "Loya-11", "Loya-18", "Pan-2", "GII-10", "GII-12", "GII-13", "GII-19", "GII-35", "Var-4", "Var-8", "Amd-1", "GIII-23", "GIII-31", "GIII-36"];

case "T18_1":
 return ["Introspection [Antardrashti/Pratilom/Jānpanu]", "", "", "", "GI-20", "GI-23", "GI-49", "GI-56", "Sar-10", "Kar-3", "GII-8", "GII-22", "GII-55", "GIII-9", "GIII-30"];

case "T19_1":
 return ["Faith [Shraddhā]", "", "", "", "GI-5", "GI-15", "Sar-5", "Sar-9", "Sar-11", "Sar-18", "Loya-8", "Loya-12", "GII-4", "GII-16", "GII-52", "GIII-24", "GIII-25"];

case "T20_1":
 return ["Self-interest in One’s Salvation", "", "", "", "GI-6", "GI-57", "Sar-10", "Loya-3", "Loya-6", "Loya-17", "GII-15", "GII-17", "GII-37", "GII-47", "Amd-3", "GIII-1", "GIII-24", "GIII-27", "GIII-34"];

case "T21_1":
 return ["Discourses/Company of Satpurush [Kathā-vārtā/Satsang/Samāgam]", "", "", "", "GI-1", "GI-2", "GI-8", "GI-14", "GI-21", "GI-29", "GI-30", "GI-51", "GI-59", "GI-70", "Sar-7", "Sar-9", "Sar-18", "Kar-1", "Kar-3", "Kar-12", "Loya-5", "Loya-8", "GII-29", "GII-49", "GII-54", "GII-66", "GIII-2", "GIII-24", "GIII-33"];

case "T22_1":
 return ["Service [Sevā]", "", "", "", "GI-8", "GI-10", "GI-31", "GI-43", "GI-47", "GI-55", "GI-71", "Sar-9", "Loya-8", "GII-7", "GII-25", "GII-28", "GII-29", "GII-40", "GII-41", "GII-47", "GII-52", "GII-59", "GII-62", "GII-63", "Var-3", "Var-5", "Amd-3", "GIII-5", "GIII-26", "GIII-34", "GIII-35"];

case "T23_1":
 return ["Loyalty [Paksha]", "", "", "", "GI-78", "Loya-6", "Pan-5", "GII-5", "GII-26", "GII-28", "GII-60", "GII-61", "GII-63", "Var-11", "GIII-7", "GIII-21"];

case "T24_1":
 return ["Fault-finding/Contempt [Abhāv-avagun/Droh]", "Loss from fault-finding", "", "", "GI-1", "GI-6", "GI-16", "GI-28", "GI-31", "GI-35", "GI-53", "GI-62", "GI-67", "GI-71", "GI-72", "GI-78", "Kar-2", "Loya-1", "Loya-16", "Loya-18", "Pan-3", "GII-11", "GII-26", "GII-27", "GII-28", "GII-40", "GII-44", "GII-46", "GII-47", "GII-53", "GII-63", "GII-65", "GII-66", "Var-11", "Var-12", "Var-14", "Var-15", "GIII-1", "GIII-11", "GIII-12", "GIII-21", "GIII-22", "GIII-35", "Jetalpur 3"];
case "T24_2":
 return ["", "Reasons for fault-finding", "", "", "GI-6", "GI-35", "GI-62", "Kar-2", "Loya-8", "Loya-16", "GII-40", "GII-44", "Var-11", "Var-12", "Var-15"];
case "T24_3":
 return ["", "How abhāv-avagun are forgiven", "", "", "Kar-2", "Kar-9", "Loya-1", "Loya-16", "Loya-17", "GII-17", "GII-59", "Var-11", "GIII-11"];
case "T24_4":
 return ["", "Finding virtues [Gungrāhak-drashti]", "", "", "GI-6", "GI-16", "GI-24", "GI-28", "GI-53", "GI-58", "GI-67", "Loya-5", "GII-26", "Var-14"];

case "T25_1":
 return ["Bad Company [Kusang]", "", "", "", "GI-8", "GI-9", "GI-16", "GI-17", "GI-18", "GI-29", "GI-42", "GI-48", "GI-55", "GI-58", "GI-68", "GI-70", "GI-78", "Sar-18", "Kar-10", "Loya-6", "Loya-13", "GII-6", "GII-18", "GII-19", "GII-32", "GII-35", "GII-44", "Var-12", "Var-15", "Var-20", "GIII-3", "GIII-32", "GIII-36", "GIII-38"];

case "T26_1":
 return ["Excommunication [Vimukh]", "", "", "", "GI-35", "GI-72", "GI-76", "GI-77", "GI-78", "Sar-9", "Kar-9", "Loya-1", "Loya-17", "Loya-18", "GII-5", "GII-9", "GII-11", "GII-26", "GII-38", "GII-47", "GII-53", "GII-60", "Var-11", "Var-12", "Var-18", "GIII-12", "GIII-32", "GIII-35"];

case "T27_1":
 return ["Complete/Perfect Bhakta [Yathārth/Puro/Pāko]", "", "", "", "GI-14", "GI-26", "GI-38", "GI-49", "GI-58", "GI-72", "GI-73", "GI-76", "Sar-15", "Kar-6", "Kar-9", "Kar-11", "Loya-1", "Loya-7", "GII-10", "GII-25", "GII-38", "GII-41", "GII-44", "GII-48", "GII-50", "GII-52", "GII-60", "GII-61", "GII-62", "Var-17", "Var-19", "Var-20", "Amd-2", "GIII-5", "GIII-14", "GIII-24", "GIII-25", "GIII-26", "GIII-28", "GIII-39", "Ashlali", "Jetalpur 3"];

case "T28_1":
 return ["Qualities of a True Sant", "", "", "", "GI-14", "GI-27", "GI-36", "GI-37", "GI-38", "GI-44", "GI-56", "GI-62", "GI-67", "GI-69", "Sar-10", "Kar-3", "Kar-6", "Kar-10", "GII-22", "GII-23", "GII-25", "GII-27", "GII-33", "GII-47", "GII-48", "GII-52", "GII-53", "GII-61", "Var-3", "Var-10", "Var-11", "GIII-26", "GIII-27", "GIII-35", "GIII-39"];

case "T29_1":
 return ["Necessity of Satpurush", "", "", "", "GI-19", "GI-27", "GI-37", "GI-43", "GI-44", "GI-51", "GI-54", "GI-55", "GI-58", "GI-59", "GI-60", "GI-64", "GI-66", "Sar-7", "Sar-10", "Sar-18", "Loya-11", "Loya-12", "Pan-2", "Pan-7", "GII-7", "GII-13", "GII-14", "GII-29", "GII-37", "GII-48", "GII-51", "Var-3", "Var-4", "Var-5", "Var-10", "Var-11", "Var-12", "Var-14", "GIII-2", "GIII-5", "GIII-14", "GIII-18", "GIII-27", "GIII-29", "GIII-38", "Ashlaali", "Jetalpur 1"];

case "T30_1":
 return ["Remarkable/Special Talks by Shriji Mahārāj", "His own viewpoint/opinion [Potāno mat]", "", "", "GI-38", "GII-9"];
case "T30_2":
 return ["", "His experienced talks [Pratyaksh dekheli vāt]", "", "", "GI-64", "GII-13", "GIII-39"];
case "T30_3":
 return ["", "His own convictions and principles [Potānā nishchay/siddhānt]", "", "", "Kar-10", "Loya-13", "Pan-1", "GII-8", "GII-13", "GII-21", "GII-27", "GII-35", "GII-43", "Var-20", "GIII-7", "GIII-10", "GIII-15", "GIII-21", "GIII-26", "GIII-32", "GIII-33", "GIII-36", "GIII-38"];
case "T30_4":
 return ["", "Likes and preferences [Ruchi]", "", "", "Loya-14", "GII-33", "GII-49", "GIII-21"];
case "T30_5":
 return ["", "Secret opinion [Rahasya/Abhiprāy]", "", "", "GII-1", "GII-21", "GII-28", "GII-50", "Var-16", "GIII-2", "Jetalpur 1"];
case "T30_6":
 return ["", "Essence of all scriptures [Sarva-shāstranā sār-rup vāt]", "", "", "GI-52", "Pan-2", "Pan-4", "GII-1", "GII-8", "GII-13", "GII-21", "GII-28", "GII-39", "GII-59", "GII-64", "Var-2", "Var-18", "GIII-10", "GIII-36", "GIII-38"];
}
}

const VACH_MAP_EN = {
    'GI': 0, 'Sar': 78, 'Kar': 96, 'Loya': 108,
    'Pan': 126, 'GII': 133, 'Var': 200, 'Amd': 220,
    'GIII': 223, 'Add': 262, 'Jetalpur': 268
};

function getVachNo(vach) {
    if (vach === 'Ashlali') return 268;

    const matchArr = vach.match(/^(\D+)(\-|\s)(\d+)$/);
    if (!matchArr) return 0;

    const vachgam = matchArr[1];
    const gamno = parseInt(matchArr[3], 10) || 0;

    return VACH_MAP_EN.hasOwnProperty(vachgam) ? (VACH_MAP_EN[vachgam] + gamno) : 0;
}

function writeTopics() {
    const topicsContainer = getObj('topics');
    let html = '';

    for (let j = 0; j < vachtopics.length; j++) {
        const topic = topics_arr(vachtopics[j]); // Cache result
        
        // Header block
        if (topic[0]) html += `<h1 class="text_en">${topic[0]}</h1>`;
        if (topic[1]) html += `<h2 class="text_en">${topic[1]}</h2>`;
        if (topic[2]) html += `<h3 class="text_en">${topic[2]}</h3>`;
        if (topic[3]) html += `<h4 class="text_en">${topic[3]}</h4>`;

        // Link block
        html += '<p style="margin:2px 0 10px 0">';
        const links = [];
        
        for (let i = 4; i < topic.length; i++) {
            const vachName = topic[i];
            const vachno = getVachNo(vachName);
            links.push(`<a target="_blank" href="index.php?format=en&vachno=${vachno}" class="text_en">${vachName}</a>`);
        }
        
        html += links.join(' | ') + '</p>';
    }
    topicsContainer.innerHTML = html;
}