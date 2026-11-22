/**
 * ============================================================================
 * FRONTEND PWA HÍBRIDO (CLOUD GITHUB PAGES + ANDROID WEBAPK + NODE/GAS 24/7)
 * Funciona 100% en tu teléfono Android (online y offline), pre-cargado con tus
 * 126 movimientos reales de tu-correo@gmail.com y sincronización 24/7.
 * ============================================================================
 */

let appState = null;
let activeTab = 'DASHBOARD';            // 'DASHBOARD' | 'DEBITO_CUENTA' | 'CREDITO' | 'FINTUAL'
let activeRankingMode = 'RECURRING';    // 'RECURRING' | 'CATEGORIES' | 'MERCHANTS'
let activeNecessityFilter = 'ALL';
let activePeriodScope = 'CURRENT_MONTH'; // 'CURRENT_MONTH' | 'MONTH' | 'SEMESTER' | 'YEAR'
let selectedMonthKey = '2026-11';        // Por defecto: Mes Actual (Noviembre 2026)
let selectedSemesterKey = '2026-S2';     // '2026-S2' (Jul-Dic) | '2026-S1' (Ene-Jun)
let selectedYearKey = '2026';            // '2026' | 'ALL'
let searchQuery = '';
let deferredInstallPrompt = null;

// Capturar evento nativo de instalación WebAPK en Android Chrome
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

// Base histórica real de los últimos 2 meses (tu-correo@gmail.com)
const BASE_REAL_ROWS = [
  [288,"1a1f8b00c0f718d0","20/11/2026 08:20",5740,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [287,"1a1f0f3a89a0a9b3","18/11/2026 20:17",5880,0,0,"HIP LIDER QUILIN","Supermercado","Necesario"],
  [286,"1a1ee665beb56db4","18/11/2026 08:24",2490,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [285,"1a1ee57ea0af2232","18/11/2026 08:08",10000,0,1,"LAS TORRES (MACD 1)","Transporte y Metro","Necesario"],
  [284,"1a1ebd6496a555bb","17/11/2026 20:27",1250,0,0,"HIP LIDER QUILIN","Supermercado","Necesario"],
  [283,"1a1e94428a51a886","17/11/2026 08:28",2490,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [282,"1a1e67221c6b6aa3","16/11/2026 19:20",4140,0,0,"MERPAGO*ANDREAPAZ","Minimarket y Almacén","Gasto Hormiga"],
  [281,"1a1e6435ba3c5927","16/11/2026 18:28",9960,0,0,"TOTTUS PLAZA EGAN","Supermercado","Necesario"],
  [280,"1a1e409c92dd6d33","16/11/2026 08:06",4480,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [279,"1a1dafda4d8fc243","14/11/2026 13:56",5990,0,0,"FARMACEUTICA","Salud y Farmacia","Necesario"],
  [278,"1a1daec2c7c45b66","14/11/2026 13:37",1900,0,0,"LICORERA CENTRAL","Restaurantes y Fast Food","Gasto Hormiga"],
  [277,"1a1daeab003f319d","14/11/2026 13:36",9350,0,0,"Supermercado El M","Supermercado","Necesario"],
  [276,"1a1d89ba3e8d493a","14/11/2026 02:50",6892,0,0,"GOOGLE *Tinder Da","Suscripciones y Apps","Gasto Hormiga"],
  [275,"1a1d6ab851502feb","13/11/2026 17:48",2800,0,0,"Almacen y bazar e","Minimarket y Almacén","Gasto Hormiga"],
  [274,"1a1d57a8845d1215","13/11/2026 12:15",1790,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [273,"1a1d4a382a8d29cd","13/11/2026 08:20",2490,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [272,"1a1d19c3533833db","12/11/2026 18:13",2910,0,0,"TOTTUS PLAZA EGAN","Supermercado","Necesario"],
  [271,"1a1d1469214aaf3a","12/11/2026 16:40",46886,0,1,"WWW.ALIEXPRESS.COM","Compras y Retail","Opcional / Prescindible"],
  [270,"1a1d070e097fbf9e","12/11/2026 12:46",7120,0,0,"CV 1179","Salud y Farmacia","Necesario"],
  [269,"1a1cf8840ead1c53","12/11/2026 08:32",4480,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [268,"1a1cc7e390d7e81f","11/11/2026 18:22",10000,0,1,"PLAZA EGANA L4 SUR","Transporte y Metro","Necesario"],
  [267,"1a1c77f5f6564bab","10/11/2026 19:06",1500,0,0,"MERPAGO*ANDREAPAZ","Minimarket y Almacén","Gasto Hormiga"],
  [266,"1a1c23edf36be9ac","09/11/2026 18:37",8596,0,0,"TOTTUS PLAZA EGAN","Supermercado","Necesario"],
  [265,"1a1c22b3e4c21502","09/11/2026 18:16",5500,0,0,"MERPAGO*DUANDYLAR","Minimarket y Almacén","Gasto Hormiga"],
  [264,"1a1c162bba38c25e","09/11/2026 14:37",2448,0,0,"TOTTUS PLAZA EGAN","Supermercado","Necesario"],
  [263,"1a1c00588ac344f1","09/11/2026 08:15",2490,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [262,"1a1bc156fb5a147e","08/11/2026 13:54",23150,0,0,"SANTA ISABEL ALMI","Supermercado","Necesario"],
  [261,"1a1b86c86f2f10c1","07/11/2026 20:51",15300,0,0,"Almacen y bazar e","Minimarket y Almacén","Opcional / Prescindible"],
  [260,"1a1b7e6a17f267cd","07/11/2026 18:25",2962,0,0,"MERPAGO*DUBLE","Minimarket y Almacén","Gasto Hormiga"],
  [259,"1a1b7729a7fbb473","07/11/2026 16:18",6902,0,0,"HIP LIDER NOS","Supermercado","Necesario"],
  [258,"1a1b32d1194554a9","06/11/2026 20:23",35020,0,0,"HIP LIDER NOS","Supermercado","Necesario"],
  [257,"1a1b2eece1ccfdc0","06/11/2026 19:15",4350,0,1,"KIOSKOS KENTUCKY PSUR","Minimarket y Almacén","Gasto Hormiga"],
  [256,"1a1b1f31380a4617","06/11/2026 14:40",25990,0,1,"ZARA MALL PLAZA EGANA.","Compras y Retail","Opcional / Prescindible"],
  [255,"1a1b09f279512ab6","06/11/2026 08:29",4980,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [254,"1a1add662a11ecb7","05/11/2026 19:31",4950,0,0,"GENESIS","Minimarket y Almacén","Gasto Hormiga"],
  [253,"1a1ada6669873601","05/11/2026 18:38",39990,0,1,"MERPAGO*VIPAROMAS","Compras y Retail","Opcional / Prescindible"],
  [252,"1a1ad9943e404917","05/11/2026 18:24",9990,0,0,"FALABELLA PLAZA E","Compras y Retail","Opcional / Prescindible"],
  [251,"1a1ac8443a4a6511","05/11/2026 13:21",4550,0,1,"KKOS KENTUCKY P.EGANA","Minimarket y Almacén","Gasto Hormiga"],
  [250,"1a1a877921df42b2","04/11/2026 18:29",10000,0,1,"PLAZA EGANA L4 SUR","Transporte y Metro","Necesario"],
  [249,"1a1a875a8f6d6609","04/11/2026 18:27",12380,0,1,"TOTTUS PLAZA EGANA","Supermercado","Necesario"],
  [248,"1a1a371710571819","03/11/2026 19:04",3420,0,0,"GENESIS","Minimarket y Almacén","Gasto Hormiga"],
  [247,"1a1a11f24b6016f8","03/11/2026 08:15",4990,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [246,"1a19d36117cb09de","02/11/2026 14:02",2290,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [245,"1a19c0c20d28e8e6","02/11/2026 08:36",40000,0,0,"Transferencia a Tercero (Cta. Externa 1) · \"tarjeta\"","Transferencias","Opcional / Prescindible"],
  [244,"1a1985b2073f97c4","01/11/2026 15:24",1500,0,0,"MINIMARKET AGUSTI","Minimarket y Almacén","Gasto Hormiga"],
  [243,"1a19738698b0e86e","01/11/2026 10:06",5150,0,0,"MERPAGO*DUBLE","Minimarket y Almacén","Gasto Hormiga"],
  [242,"1a193524f3cedc28","31/10/2026 15:56",12000,0,0,"Transferencia a Tercero (Cta. Externa 2)","Transferencias","Opcional / Prescindible"],
  [241,"1a192c90d6639ae0","31/10/2026 13:26",1800,0,0,"Almacen y bazar e","Minimarket y Almacén","Gasto Hormiga"],
  [240,"1a18e98d35e39c88","30/10/2026 17:55",899346,1,0,"Abono Remuneración Mensual (REM 202610)","Ingresos / Abonos","Ingreso"],
  [239,"1a18e708c7ea3170","30/10/2026 17:11",17780,0,0,"LBB COSTANERA SPA","Restaurantes y Fast Food","Opcional / Prescindible"],
  [238,"1a18e6d660e5d93a","30/10/2026 17:08",157756,0,0,"Pago Tarjeta de Crédito Nacional ****4114","Pago Tarjeta de Crédito","Necesario"],
  [237,"1a18df556894de5b","30/10/2026 14:57",4400,0,0,"SOUTHERN FRANCHIS","Restaurantes y Fast Food","Gasto Hormiga"],
  [236,"1a18dc4d67f60b3e","30/10/2026 14:02",7600,0,1,"CINEPLANET COSTANERA","Ocio y Entretenimiento","Opcional / Prescindible"],
  [235,"1a18c8e2f523a2a3","30/10/2026 08:24",4480,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [234,"1a18882233d7cc6a","29/10/2026 13:33",2880,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [233,"1a186b0aa872ef80","29/10/2026 05:04",25023,0,1,"SMART FIT GIMNASIOS","Salud y Gimnasio","Opcional / Prescindible"],
  [232,"1a18683244ac2455","29/10/2026 04:14",41880,0,1,"SMART FIT GIMNASIOS","Salud y Gimnasio","Opcional / Prescindible"],
  [231,"1a184615e20b5da1","28/10/2026 18:18",10000,0,1,"PLAZA EGANA L4 SUR","Transporte y Metro","Necesario"],
  [230,"1a1845eb5df6c5cf","28/10/2026 18:16",9140,0,0,"TOTTUS PLAZA EGAN","Supermercado","Necesario"],
  [229,"1a17f60d2f28a6cb","27/10/2026 19:00",2600,0,0,"GENESIS","Minimarket y Almacén","Gasto Hormiga"],
  [228,"1a17a528d4a7e0b2","26/10/2026 19:26",30490,0,1,"COMERCIALIZADORA CS LT","Compras y Retail","Opcional / Prescindible"],
  [227,"1a1794d5c865da7c","26/10/2026 14:41",1490,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [226,"1a17590413c326e7","25/10/2026 21:15",2600,0,0,"Verduleria Dylam","Supermercado","Necesario"],
  [225,"1a174940e83683cd","25/10/2026 16:40",1524,0,0,"MERPAGO*DUBLE","Minimarket y Almacén","Gasto Hormiga"],
  [224,"1a16b08fae87da02","23/10/2026 20:11",1617,0,0,"MERPAGO*DUBLE","Minimarket y Almacén","Gasto Hormiga"],
  [223,"1a16a3f98fdfa46e","23/10/2026 16:31",1900,0,0,"TOP MARKET","Minimarket y Almacén","Gasto Hormiga"],
  [222,"1a16a07aad8dc953","23/10/2026 15:30",49990,0,1,"MALL PLAZA SUR","Compras y Retail","Opcional / Prescindible"],
  [221,"1a169f9bc74a75d4","23/10/2026 15:15",4400,0,0,"DOC POPCORN MALL","Restaurantes y Fast Food","Gasto Hormiga"],
  [220,"1a169f6e30f46048","23/10/2026 15:12",19980,0,1,"FASHIONS PARK PLAZA MA","Compras y Retail","Opcional / Prescindible"],
  [219,"1a165f64ec0dd323","22/10/2026 20:33",2594,0,0,"PAYU *UBER TRIP","Transporte y Metro","Gasto Hormiga"],
  [218,"1a165f1586ad600f","22/10/2026 20:27",6390,0,0,"TOTTUS QUILIN","Supermercado","Necesario"],
  [217,"1a164048aa5246aa","22/10/2026 14:29",100000,1,0,"Transferencia Recibida en Cuenta (\"pago IA\")","Ingresos / Abonos","Ingreso"],
  [216,"1a1640436afbef8e","22/10/2026 11:29",7800,0,1,"GOOGLE *Google One","Suscripciones y Apps","Opcional / Prescindible"],
  [215,"1a1605e6bc820c00","21/10/2026 18:29",10000,0,1,"PLAZA EGANA L4 SUR","Transporte y Metro","Necesario"],
  [214,"1a1605af28c6fafe","21/10/2026 18:25",3790,0,0,"TOTTUS PLAZA EGAN","Supermercado","Necesario"],
  [213,"1a15f7489d31eda0","21/10/2026 14:13",4000,0,0,"MERPAGO*STANKOPAG","Minimarket y Almacén","Gasto Hormiga"],
  [212,"1a1564f58a8935aa","19/10/2026 19:36",1100,0,0,"MERPAGO*ANDREAPAZ","Minimarket y Almacén","Gasto Hormiga"],
  [211,"1a1564b7b6e69259","19/10/2026 19:32",1450,0,0,"GENESIS","Minimarket y Almacén","Gasto Hormiga"],
  [210,"1a1562f154605fc5","19/10/2026 19:01",3680,0,0,"GENESIS","Minimarket y Almacén","Gasto Hormiga"],
  [209,"1a15595cd465161d","19/10/2026 16:14",1790,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [208,"1a153daad25f615a","19/10/2026 08:09",4250,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [207,"1a14bb304141b1e4","17/10/2026 18:09",11240,0,0,"MERPAGO*DUBLE","Minimarket y Almacén","Gasto Hormiga"],
  [206,"1a146a3464b54bfe","16/10/2026 18:34",22209,0,0,"CAFE AUSTRALIS","Restaurantes y Fast Food","Opcional / Prescindible"],
  [205,"1a1461a97ed8ff2c","16/10/2026 16:05",950,0,0,"FRESH MARKET","Minimarket y Almacén","Gasto Hormiga"],
  [204,"1a14393e85912b61","16/10/2026 04:18",21390,0,1,"SMART FIT GIMNASIOS","Salud y Gimnasio","Opcional / Prescindible"],
  [203,"1a1436ea95468760","16/10/2026 03:37",34900,0,1,"SMART FIT GIMNASIOS","Salud y Gimnasio","Opcional / Prescindible"],
  [202,"1a141da1f5c112a8","15/10/2026 20:16",2000,0,0,"TOTTUS QUILIN","Supermercado","Necesario"],
  [201,"1a1405babc3349b6","15/10/2026 13:18",3800,0,1,"KKOS KENTUCKY P.EGANA","Minimarket y Almacén","Gasto Hormiga"],
  [200,"1a13f317c1e2d8be","15/10/2026 07:52",10000,0,1,"LAS TORRES (MACD 1)","Transporte y Metro","Necesario"],
  [199,"1a13b49856c1b503","14/10/2026 13:40",9350,0,0,"20073-BK PLAZA EG","Restaurantes y Fast Food","Opcional / Prescindible"],
  [198,"1a1308e06a1d995c","12/10/2026 11:39",1800,0,0,"Almacen y bazar e","Minimarket y Almacén","Gasto Hormiga"],
  [197,"1a12cc16e03e8f05","11/10/2026 17:57",4300,0,0,"MINIMARKET AIMAR","Minimarket y Almacén","Gasto Hormiga"],
  [196,"1a1282549d42ed16","10/10/2026 20:28",9193,0,0,"PAYU *UBER TRIP","Transporte y Metro","Opcional / Prescindible"],
  [195,"1a1205d979739492","09/10/2026 08:12",1990,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [194,"1a11b43a93b7ab25","08/10/2026 08:26",2490,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [193,"1a11871122c3df3b","07/10/2026 19:17",10000,0,0,"Giro en Cajero Automático","Cajero Automático","Opcional / Prescindible"],
  [192,"1a118397ffe03039","07/10/2026 18:16",9800,0,0,"TIP TOP METRO NUN","Transporte y Metro","Necesario"],
  [191,"1a1161aa1cc0b915","07/10/2026 08:23",2490,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [190,"1a1120468b42a4de","06/10/2026 13:20",6216,0,0,"TB MALL PLAZA EGA","Restaurantes y Fast Food","Gasto Hormiga"],
  [189,"1a110f03782d3e93","06/10/2026 08:18",1990,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [188,"1a10e7520417b547","05/10/2026 20:45",3650,0,0,"Minimarket Aimar","Minimarket y Almacén","Gasto Hormiga"],
  [187,"1a10bc7004acbaf6","05/10/2026 08:15",4470,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [186,"1a1078e8f7a72b03","04/10/2026 12:35",500,0,0,"SNACKCENTER","Minimarket y Almacén","Gasto Hormiga"],
  [185,"1a1078a700b08602","04/10/2026 12:31",700,0,0,"SNACKCENTER","Minimarket y Almacén","Gasto Hormiga"],
  [184,"1a1044db4c8e3ef3","03/10/2026 21:26",1900,0,0,"Almacen y bazar e","Minimarket y Almacén","Gasto Hormiga"],
  [183,"1a102f1fe447622c","03/10/2026 15:06",1500,0,0,"MINIMARKET AGUSTI","Minimarket y Almacén","Gasto Hormiga"],
  [182,"1a0fe62b2b9f56e3","02/10/2026 17:51",1330,0,0,"MINIMARKET AIMAR","Minimarket y Almacén","Gasto Hormiga"],
  [181,"1a0fc525e665aac0","02/10/2026 08:14",3280,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [180,"1a0f9c579efe9989","01/10/2026 20:21",5200,0,0,"FARMACEUTICA","Salud y Farmacia","Necesario"],
  [179,"1a0f72432c4dc865","01/10/2026 08:05",2490,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [178,"1a0f35e947e3e827","30/09/2026 14:30",240000,1,0,"Abono Honorarios Septiembre (BH)","Ingresos / Abonos","Ingreso"],
  [177,"1a0f21731d2e559c","30/09/2026 08:33",1990,0,0,"SERVICIOS Y COMER","Alimentación / Cafetería","Gasto Hormiga"],
  [176,"1a0f1dbfb6918d8e","30/09/2026 07:28",10000,0,0,"Giro en Cajero Automático","Cajero Automático","Opcional / Prescindible"],
  [175,"1a0ef53150373b24","29/09/2026 19:39",2530,0,0,"HIP LIDER NOS","Supermercado","Necesario"],
  [174,"1a0ee33ed1c364f0","29/09/2026 14:26",2990,0,0,"MALLPLAZA EGANA","Compras y Retail","Gasto Hormiga"],
  [173,"1a0ec167feb0be73","29/09/2026 04:34",25023,0,1,"SMART FIT GIMNASIOS","Salud y Gimnasio","Opcional / Prescindible"],
  [172,"1a0ebc06e09de3c9","29/09/2026 03:00",22800,0,1,"SMART FIT GIMNASIOS","Salud y Gimnasio","Opcional / Prescindible"],
  [171,"1a0ea322928acb2c","28/09/2026 19:45",2530,0,0,"620-SAN BERNARDO","Minimarket y Almacén","Gasto Hormiga"],
  [170,"1a0da054281c8e4a","25/09/2026 16:22",611,0,0,"GOOGLE *Bumble Da","Suscripciones y Apps","Gasto Hormiga"],
  [169,"1a0d5b7f5a06209a","24/09/2026 20:19",12000,0,0,"Transferencia a Tercero (Cta. Externa 2)","Transferencias","Opcional / Prescindible"],
  [168,"1a0d41ea13a6041e","24/09/2026 12:52",69787,0,0,"Pago Tarjeta de Crédito Nacional ****4114","Pago Tarjeta de Crédito","Necesario"],
  [167,"1a0cde6568f6467a","23/09/2026 07:53",10000,0,0,"Giro en Cajero Automático","Cajero Automático","Opcional / Prescindible"],
  [166,"1a0cc33d0719cfa0","22/09/2026 23:58",120000,1,0,"Transferencia Recibida en Cuenta","Ingresos / Abonos","Ingreso"],
  [165,"1a0ca5cb16c36c7f","22/09/2026 15:24",3093,0,0,"PAYU *UBER TRIP","Transporte y Metro","Gasto Hormiga"],
  [164,"1a0c26018fd064a8","21/09/2026 02:10",34900,0,1,"SMART FIT GIMNASIOS","Salud y Gimnasio","Opcional / Prescindible"],
  [163,"1a0c0ab680a102b9","20/09/2026 18:14",4000,0,0,"Transferencia a Tercero (Cta. Externa 1) · \"mote\"","Transferencias","Gasto Hormiga"]
];

function getDefaultJustification(mer, cat, nec) {
  if (nec === 'Ingreso') return 'Abono de fondos en Cuenta Corriente ****0401 (remuneración, honorarios o transferencia recibida).';
  const u = (mer || '').toUpperCase();
  if (u.includes('SERVICIOS Y COMER')) return 'Gasto hormiga altamente recurrente (24 compras matutinas ~08:20 hrs); principal fuga acumulada del bimestre.';
  if (u.includes('SMART FIT')) return 'Cargo recurrente en Smart Fit Gimnasios (7 cobros en el bimestre con Tarjeta ****4114).';
  if (u.includes('TOTTUS') || u.includes('LIDER') || u.includes('SANTA ISABEL') || u.includes('SUPERMERCADO') || u.includes('VERDULERIA')) return 'Abastecimiento esencial de alimentación y hogar en supermercado.';
  if (u.includes('PLAZA EGANA L4') || u.includes('LAS TORRES')) return 'Recarga de transporte público (Metro de Santiago / Bip!) para movilidad esencial.';
  if (u.includes('PAGO TARJETA')) return 'Pago de estado de cuenta de Tarjeta de Crédito Nacional ****4114 desde Cuenta Corriente.';
  if (cat === 'Salud y Farmacia') return 'Compra prioritaria de medicamentos o productos de salud en farmacia.';
  if (nec === 'Gasto Hormiga') return `Micro-compra en ${mer}; su repetición frecuente en el bimestre actúa como gasto hormiga.`;
  return `Gasto discrecional en ${mer} clasificado como opcional.`;
}

function getMerchantGroupKey(merchant = '') {
  const u = merchant.toUpperCase();
  if (u.includes('SERVICIOS Y COMER')) return 'SERVICIOS Y COMER';
  if (u.includes('TOTTUS')) return 'SUPERMERCADOS TOTTUS';
  if (u.includes('HIP LIDER') || u.includes('LIDER')) return 'SUPERMERCADOS LÍDER';
  if (u.includes('SMART FIT')) return 'SMART FIT GIMNASIOS';
  if (u.includes('PLAZA EGANA L4') || u.includes('LAS TORRES (MACD')) return 'METRO DE SANTIAGO (Carga Bip!)';
  if (u.includes('ALMACEN Y BAZAR')) return 'ALMACÉN Y BAZAR';
  if (u.includes('MERPAGO*DUBLE')) return 'MERPAGO*DUBLE';
  if (u.includes('GENESIS')) return 'ALMACÉN GÉNESIS';
  if (u.includes('MERPAGO*ANDREAPAZ')) return 'MERPAGO*ANDREAPAZ';
  if (u.includes('MINIMARKET AIMAR')) return 'MINIMARKET AIMAR';
  if (u.includes('KENTUCKY')) return 'KIOSCOS KENTUCKY';
  if (u.includes('UBER TRIP')) return 'UBER TRIP';
  if (u.includes('FARMACEUTICA') || u.includes('CV 1179')) return 'FARMACIAS (Cruz Verde / Farmacéutica)';
  if (u.includes('MINIMARKET AGUSTI')) return 'MINIMARKET AGUSTI';
  if (u.includes('SNACKCENTER')) return 'SNACKCENTER';
  return merchant;
}

// Estado local persistente para modo Cloud / GitHub Pages en Android
let localTransactions = (() => {
  try {
    const saved = localStorage.getItem('bch_local_txs_v2');
    if (saved) return JSON.parse(saved);
  } catch {}
  return BASE_REAL_ROWS.map(([id, mid, dt, amt, isIng, isCred, mer, cat, nec]) => ({
    id,
    gmail_message_id: mid,
    display_date: dt,
    amount: amt,
    flow_type: isIng ? 'INGRESO' : 'EGRESO',
    instrument: isCred ? 'CREDITO' : 'DEBITO_CUENTA',
    card_last4: isCred ? 'Tarjeta Crédito ****4114' : 'Cuenta ****0401',
    merchant: mer,
    category: cat,
    necessity_level: nec,
    ai_justification: getDefaultJustification(mer, cat, nec),
    source: 'GMAIL_REAL'
  }));
})();

let localRules = (() => {
  try {
    const saved = localStorage.getItem('bch_local_rules_v2');
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
})();

let localFintualPositions = (() => {
  try {
    const saved = localStorage.getItem('bch_local_fintual_pos_v2');
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
    { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', asset_type: 'ETF', shares: 0.45, avg_buy_price_usd: 512.40, current_price_usd: 548.80, target_weight_pct: 45, notes: 'Núcleo indexado S&P 500 (DCA mensual)' },
    { ticker: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq-100)', asset_type: 'ETF', shares: 0.28, avg_buy_price_usd: 478.10, current_price_usd: 514.50, target_weight_pct: 25, notes: 'Exposición tecnológica US Growth' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', asset_type: 'STOCK', shares: 1.15, avg_buy_price_usd: 118.50, current_price_usd: 141.20, target_weight_pct: 15, notes: 'Semiconductores e infraestructura IA' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', asset_type: 'STOCK', shares: 0.22, avg_buy_price_usd: 415.00, current_price_usd: 438.90, target_weight_pct: 15, notes: 'Cloud Azure & Copilot Enterprise' }
  ];
})();

let localFintualSignals = (() => {
  try {
    const saved = localStorage.getItem('bch_local_fintual_sig_v2');
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
    { agent_id: 'fintual-invest-agent-v1', action_type: 'DCA', ticker: 'VOO', suggested_amount_clp: 120000, suggested_amount_usd: 123.71, confidence_pct: 92, reasoning: 'Acumulación periódica en S&P 500 aprovechando liquidez libre en Cuenta Corriente ****0401 post-reserva de Tarjeta de Crédito.', source_liquidity_note: 'Excedente neto disponible tras apartar $201.353 CLP para pagar TC ****4114.' },
    { agent_id: 'fintual-invest-agent-v1', action_type: 'BUY', ticker: 'QQQ', suggested_amount_clp: 74790, suggested_amount_usd: 77.10, confidence_pct: 88, reasoning: 'Redirección equivalente al 100% de tu gasto hormiga bimestral en SERVICIOS Y COMER (24 compras = $74.790 CLP) hacia Nasdaq-100.', source_liquidity_note: 'Reasignación de ahorro por control de gasto hormiga detectado por el Agente Mi Cuenta.' }
  ];
})();

function saveLocalState() {
  try {
    localStorage.setItem('bch_local_txs_v2', JSON.stringify(localTransactions));
    localStorage.setItem('bch_local_rules_v2', JSON.stringify(localRules));
    localStorage.setItem('bch_local_fintual_pos_v2', JSON.stringify(localFintualPositions));
    localStorage.setItem('bch_local_fintual_sig_v2', JSON.stringify(localFintualSignals));
  } catch {}
}

function formatCLP(num) {
  const n = Math.round(Number(num) || 0);
  const abs = Math.abs(n).toLocaleString('es-CL');
  return n < 0 ? `-$${abs}` : `$${abs}`;
}

function formatUSD(num) {
  const n = Number(num) || 0;
  const sign = n < 0 ? '-' : '';
  return `${sign}US$${Math.abs(n).toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getTxMonthKey(tx) {
  if (tx.display_date && tx.display_date.includes('/')) {
    const parts = tx.display_date.split(' ')[0].split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}`;
  }
  return (tx.transaction_date || '2026-11').slice(0, 7);
}

const MONTH_NAMES_MAP = {
  '2026-01': 'Enero 2026',
  '2026-02': 'Febrero 2026',
  '2026-03': 'Marzo 2026',
  '2026-04': 'Abril 2026',
  '2026-05': 'Mayo 2026',
  '2026-06': 'Junio 2026',
  '2026-07': 'Julio 2026',
  '2026-08': 'Agosto 2026',
  '2026-09': 'Septiembre 2026',
  '2026-10': 'Octubre 2026',
  '2026-11': 'Noviembre 2026',
  '2026-12': 'Diciembre 2026'
};

/**
 * Devuelve la configuración del período activo (Mes Actual por defecto, Por Mes, Por Semestre o Por Año)
 */
function getPeriodInfo() {
  if (activePeriodScope === 'CURRENT_MONTH') {
    return {
      scope: 'CURRENT_MONTH',
      key: '2026-11',
      label: 'Noviembre 2026 (Mes Actual)',
      shortLabel: 'Noviembre 2026',
      monthsDivisor: 1,
      matches: (tx) => getTxMonthKey(tx) === '2026-11'
    };
  }
  if (activePeriodScope === 'MONTH') {
    const mName = MONTH_NAMES_MAP[selectedMonthKey] || selectedMonthKey;
    return {
      scope: 'MONTH',
      key: selectedMonthKey,
      label: selectedMonthKey === '2026-11' ? 'Noviembre 2026 (Mes Actual)' : mName,
      shortLabel: mName,
      monthsDivisor: 1,
      matches: (tx) => getTxMonthKey(tx) === selectedMonthKey
    };
  }
  if (activePeriodScope === 'SEMESTER') {
    if (selectedSemesterKey === '2026-S1') {
      return {
        scope: 'SEMESTER',
        key: '2026-S1',
        label: '1° Semestre 2026 (Ene – Jun)',
        shortLabel: '1° Semestre 2026',
        monthsDivisor: 1,
        matches: (tx) => {
          const mk = getTxMonthKey(tx);
          return mk >= '2026-01' && mk <= '2026-06';
        }
      };
    }
    return {
      scope: 'SEMESTER',
      key: '2026-S2',
      label: '2° Semestre 2026 (Jul – Dic)',
      shortLabel: '2° Semestre 2026',
      monthsDivisor: 2,
      matches: (tx) => {
        const mk = getTxMonthKey(tx);
        return mk >= '2026-07' && mk <= '2026-12';
      }
    };
  }
  // activePeriodScope === 'YEAR'
  if (selectedYearKey === 'ALL') {
    return {
      scope: 'YEAR',
      key: 'ALL',
      label: 'Histórico Completo Acumulado',
      shortLabel: 'Histórico Total',
      monthsDivisor: 2,
      matches: () => true
    };
  }
  return {
    scope: 'YEAR',
    key: selectedYearKey,
    label: `Año ${selectedYearKey} (Ene – Dic)`,
    shortLabel: `Año ${selectedYearKey}`,
    monthsDivisor: 2,
    matches: (tx) => getTxMonthKey(tx).startsWith(`${selectedYearKey}-`)
  };
}

function setPeriodScope(scope) {
  activePeriodScope = scope;
  if (scope === 'CURRENT_MONTH') {
    selectedMonthKey = '2026-11';
  }
  appState = buildClientSideState();
  renderDashboard();
}

function setSubPeriod(val) {
  if (activePeriodScope === 'MONTH' || activePeriodScope === 'CURRENT_MONTH') {
    activePeriodScope = 'MONTH';
    selectedMonthKey = val;
  } else if (activePeriodScope === 'SEMESTER') {
    selectedSemesterKey = val;
  } else if (activePeriodScope === 'YEAR') {
    selectedYearKey = val;
  }
  appState = buildClientSideState();
  renderDashboard();
}

function renderPeriodSelectorBar() {
  const scopes = ['CURRENT_MONTH', 'MONTH', 'SEMESTER', 'YEAR'];
  scopes.forEach((sc) => {
    const btn = document.getElementById(`p-mode-${sc}`);
    if (btn) btn.classList.toggle('active', activePeriodScope === sc);
  });

  const subContainer = document.getElementById('period-sub-options');
  if (!subContainer || !appState) return;

  const pInfo = appState.periodInfo;

  if (activePeriodScope === 'CURRENT_MONTH') {
    subContainer.innerHTML = `
      <span class="badge badge-necesario mono" style="padding:5px 10px;">
        ✓ Por defecto: ${pInfo.label} (${appState.counts.total} movs del mes · ${appState.counts.allHistoryTotal} en historial)
      </span>
      <button class="pill-btn" onclick="setPeriodScope('SEMESTER')" title="Ver acumulado del semestre">
        Ver 2° Semestre (${appState.counts.allHistoryTotal} movs) →
      </button>
    `;
  } else if (activePeriodScope === 'MONTH') {
    const quickMonths = [
      { key: '2026-11', label: 'Nov 2026 (Actual)' },
      { key: '2026-10', label: 'Oct 2026' },
      { key: '2026-09', label: 'Sep 2026' }
    ];
    const quickBtns = quickMonths
      .map((m) => {
        const count = localTransactions.filter((t) => getTxMonthKey(t) === m.key).length;
        return `<button class="pill-btn ${selectedMonthKey === m.key ? 'active' : ''}" onclick="setSubPeriod('${m.key}')">${m.label} (${count})</button>`;
      })
      .join('');

    const allMonthsOptions = Object.entries(MONTH_NAMES_MAP)
      .reverse()
      .map(([k, name]) => {
        const c = localTransactions.filter((t) => getTxMonthKey(t) === k).length;
        return `<option value="${k}" ${selectedMonthKey === k ? 'selected' : ''}>${name} (${c} movs)</option>`;
      })
      .join('');

    subContainer.innerHTML = `
      ${quickBtns}
      <select
        aria-label="Seleccionar cualquier mes del año"
        onchange="setSubPeriod(this.value)"
        style="background:var(--bg-elevated); color:var(--text-primary); border:1px solid var(--border-subtle); border-radius:999px; padding:4px 10px; font-size:12px; font-weight:600; cursor:pointer;"
      >
        ${allMonthsOptions}
      </select>
    `;
  } else if (activePeriodScope === 'SEMESTER') {
    const s2Count = localTransactions.filter((t) => {
      const mk = getTxMonthKey(t);
      return mk >= '2026-07' && mk <= '2026-12';
    }).length;
    const s1Count = localTransactions.filter((t) => {
      const mk = getTxMonthKey(t);
      return mk >= '2026-01' && mk <= '2026-06';
    }).length;

    subContainer.innerHTML = `
      <button class="pill-btn ${selectedSemesterKey === '2026-S2' ? 'active' : ''}" onclick="setSubPeriod('2026-S2')">
        2° Semestre 2026 · Jul–Dic (${s2Count} movs)
      </button>
      <button class="pill-btn ${selectedSemesterKey === '2026-S1' ? 'active' : ''}" onclick="setSubPeriod('2026-S1')">
        1° Semestre 2026 · Ene–Jun (${s1Count} movs)
      </button>
    `;
  } else if (activePeriodScope === 'YEAR') {
    const y2026Count = localTransactions.filter((t) => getTxMonthKey(t).startsWith('2026-')).length;
    subContainer.innerHTML = `
      <button class="pill-btn ${selectedYearKey === '2026' ? 'active' : ''}" onclick="setSubPeriod('2026')">
        Año 2026 · Ene–Dic (${y2026Count} movs)
      </button>
      <button class="pill-btn ${selectedYearKey === 'ALL' ? 'active' : ''}" onclick="setSubPeriod('ALL')">
        Histórico Completo (${localTransactions.length} movs)
      </button>
    `;
  }
}

/**
 * Construye el objeto completo appState filtrado dinámicamente por el Período Activo
 * (Mes Actual por defecto = Noviembre 2026, o Por Mes, Por Semestre, Por Año).
 */
function buildClientSideState() {
  const allTxs = localTransactions;
  const periodInfo = getPeriodInfo();
  const txs = allTxs.filter(periodInfo.matches);
  const usdRate = 970;
  const divisor = Math.max(1, periodInfo.monthsDivisor || 1);

  // Saldo real acumulado en Cuenta Corriente ****0401 (considerando el sueldo REM $899.346 abonado el 30/10)
  const allDebTxs = allTxs.filter((t) => t.instrument === 'DEBITO_CUENTA');
  const allDebIng = allDebTxs.filter((t) => t.flow_type === 'INGRESO').reduce((s, t) => s + t.amount, 0);
  const allDebEgr = allDebTxs.filter((t) => t.flow_type === 'EGRESO').reduce((s, t) => s + t.amount, 0);
  const saldoAcumuladoCuenta = allDebIng - allDebEgr;

  function buildAuditForList(subList, instLabel) {
    const ingresos = subList.filter((t) => t.flow_type === 'INGRESO');
    const egresos = subList.filter((t) => t.flow_type === 'EGRESO');
    const totalIng = ingresos.reduce((s, t) => s + t.amount, 0);
    const totalEgr = egresos.reduce((s, t) => s + t.amount, 0);
    const totalTEF = egresos
      .filter((t) => t.category.includes('Transferencia') || t.category.includes('Pago Tarjeta'))
      .reduce((s, t) => s + t.amount, 0);

    const nec = egresos.filter((t) => t.necessity_level === 'Necesario');
    const opc = egresos.filter((t) => t.necessity_level === 'Opcional / Prescindible');
    const hor = egresos.filter((t) => t.necessity_level === 'Gasto Hormiga');

    const mNec = nec.reduce((s, t) => s + t.amount, 0);
    const mOpc = opc.reduce((s, t) => s + t.amount, 0);
    const mHor = hor.reduce((s, t) => s + t.amount, 0);
    const mNoEs = mOpc + mHor;

    const pNec = totalEgr > 0 ? Math.round((mNec / totalEgr) * 100) : 0;
    const pOpc = totalEgr > 0 ? Math.round((mOpc / totalEgr) * 100) : 0;
    const pHor = totalEgr > 0 ? Math.max(0, 100 - pNec - pOpc) : 0;
    const pNoEs = pOpc + pHor;

    const catMap = {};
    const merMap = {};
    for (const t of egresos) {
      if (!catMap[t.category]) catMap[t.category] = { category: t.category, amount: 0, count: 0 };
      catMap[t.category].amount += t.amount;
      catMap[t.category].count += 1;

      const gk = getMerchantGroupKey(t.merchant);
      if (!merMap[gk]) merMap[gk] = { merchant: gk, category: t.category, necessity_level: t.necessity_level, amount: 0, count: 0 };
      merMap[gk].amount += t.amount;
      merMap[gk].count += 1;
    }

    const topCategories = Object.values(catMap)
      .sort((a, b) => b.amount - a.amount)
      .map((c) => ({ ...c, percentage: totalEgr > 0 ? Math.round((c.amount / totalEgr) * 100) : 0 }));

    const topMerchants = Object.values(merMap)
      .sort((a, b) => b.amount - a.amount)
      .map((m) => ({
        ...m,
        avgTicket: Math.round(m.amount / m.count),
        percentage: totalEgr > 0 ? Math.round((m.amount / totalEgr) * 100) : 0
      }));

    const recurringMerchants = topMerchants
      .filter((m) => m.count >= 2)
      .sort((a, b) => b.count - a.count || b.amount - a.amount);

    const ahorroPeriodo = Math.round(mNoEs / 2);
    const ahorroMensual = Math.round(ahorroPeriodo / divisor);
    const ahorroAnual = ahorroMensual * 12;
    const topRec = recurringMerchants[0];

    return {
      kpis: {
        saldoNetoMes: totalIng - totalEgr,
        saldoAcumuladoCuenta,
        totalIngresos: totalIng,
        totalEgresos: totalEgr,
        totalTransferencias: totalTEF,
        totalComprasDebito: totalEgr - totalTEF,
        cantidadMovimientos: subList.length,
        cantidadCompras: egresos.length,
        cantidadComprasComercio: egresos.filter((t) => !t.category.includes('Transferencia') && !t.category.includes('Pago Tarjeta')).length,
        recurrentesCount: recurringMerchants.length,
        proyeccionFacturacion: Math.round(totalEgr / divisor)
      },
      semaphore: {
        necesario: { amount: mNec, percentage: pNec, count: nec.length },
        opcional: { amount: mOpc, percentage: pOpc, count: opc.length },
        hormiga: { amount: mHor, percentage: pHor, count: hor.length },
        noEsencialTotal: {
          amount: mNoEs,
          percentage: pNoEs,
          potentialBimonthlySavings: ahorroPeriodo,
          potentialMonthlySavings: ahorroMensual,
          potentialAnnualSavings: ahorroAnual
        }
      },
      topCategories,
      topMerchants,
      recurringMerchants,
      agentAlert: {
        severity: pNoEs >= 50 ? 'warning' : 'healthy',
        title: `Auditoría (${periodInfo.shortLabel}): ${pNoEs}% en gastos no esenciales`,
        message: `En ${periodInfo.label}, el ${pNoEs}% de ${instLabel} (${formatCLP(mNoEs)} CLP en ${opc.length + hor.length} cargos) se ha ido en gastos Opcionales (${pOpc}%) y Gasto Hormiga (${pHor}%).${topRec ? ` Destaca "${topRec.merchant}" con ${topRec.count} cargos por ${formatCLP(topRec.amount)} CLP.` : ''} Reducir estos gastos no esenciales a la mitad libera ${formatCLP(ahorroPeriodo)} CLP en el período (${formatCLP(ahorroAnual)} CLP/año).`,
        potentialMonthlySavings: ahorroPeriodo,
        potentialAnnualSavings: ahorroAnual
      }
    };
  }

  const debTxs = txs.filter((t) => t.instrument === 'DEBITO_CUENTA');
  const credTxs = txs.filter((t) => t.instrument === 'CREDITO');
  const consumoRealTxs = txs.filter((t) => !t.category.includes('Pago Tarjeta'));

  const debAudit = buildAuditForList(debTxs, 'tu Cuenta Corriente / Débito ****0401');
  const credAudit = buildAuditForList(credTxs, 'tu Tarjeta de Crédito ****4114');
  const globalBase = buildAuditForList(consumoRealTxs, 'tu consumo consolidado (Débito + Crédito)');

  // Facturación mensual Tarjeta de Crédito (calculada sobre todo el historial para mostrar siempre el calendario de reserva)
  const allCredTxs = allTxs.filter((t) => t.instrument === 'CREDITO');
  const novCred = allCredTxs.filter((t) => getTxMonthKey(t) === '2026-11');
  const octCred = allCredTxs.filter((t) => getTxMonthKey(t) === '2026-10');
  const sepCred = allCredTxs.filter((t) => getTxMonthKey(t) === '2026-09');
  const novSum = novCred.reduce((s, t) => s + t.amount, 0);
  const octSum = octCred.reduce((s, t) => s + t.amount, 0);
  const sepSum = sepCred.reduce((s, t) => s + t.amount, 0);
  const totalCredAcumulado = allCredTxs.reduce((s, t) => s + t.amount, 0);
  const remanenteOct = 37207;
  const reservarNov = novSum + remanenteOct;

  credAudit.monthlyBilling = {
    totalHistoryAmount: totalCredAcumulado,
    totalHistoryCount: allCredTxs.length,
    currentCycle: {
      monthKey: '2026-11',
      purchasesThisMonth: novSum,
      purchasesCount: novCred.length,
      carryOverFromLastCut: remanenteOct,
      totalToReserve: reservarNov
    },
    months: [
      {
        monthKey: '2026-11',
        label: 'Noviembre 2026',
        subLabel: 'Ciclo en Curso · Por Facturar (~23 Nov)',
        status: 'POR_PAGAR',
        statusBadge: '⏳ Reservar para Fin de Mes',
        purchasesAmount: novSum,
        purchasesCount: novCred.length,
        billedOrToReserve: reservarNov,
        note: `${formatCLP(novSum)} en compras de Noviembre + $37.207 remanente tras el pago del 30/10.`
      },
      {
        monthKey: '2026-10',
        label: 'Octubre 2026',
        subLabel: 'Facturado el 24/10 · Pagado el 30/10',
        status: 'PAGADO',
        statusBadge: '✅ Pagado ($157.756 el 30/10)',
        purchasesAmount: octSum,
        purchasesCount: octCred.length,
        billedOrToReserve: 157756,
        note: `Pagaste $157.756 el 30/10 (de $194.963 utilizados). Las compras hechas después del corte del 23/10 pasaron al ciclo siguiente.`
      },
      {
        monthKey: '2026-09',
        label: 'Septiembre 2026',
        subLabel: 'Facturado el 22/09 · Pagado el 24/09',
        status: 'PAGADO',
        statusBadge: '✅ Pagado ($69.787 el 24/09)',
        purchasesAmount: sepSum,
        purchasesCount: sepCred.length,
        billedOrToReserve: 69787,
        note: `Estado de cuenta cerrado el 22/09 y pagado íntegramente el 24/09 ($69.787 CLP).`
      }
    ]
  };

  const monthDefs = [
    { key: '2026-09', label: 'Septiembre 2026' },
    { key: '2026-10', label: 'Octubre 2026' },
    { key: '2026-11', label: 'Noviembre 2026 (Actual)' }
  ];
  const monthlyComparison = monthDefs.map((m) => {
    const mt = allTxs.filter((t) => getTxMonthKey(t) === m.key);
    const ingresos = mt.filter((t) => t.flow_type === 'INGRESO').reduce((s, t) => s + t.amount, 0);
    const consumoDebito = mt
      .filter((t) => t.flow_type === 'EGRESO' && t.instrument === 'DEBITO_CUENTA' && !t.category.includes('Pago Tarjeta'))
      .reduce((s, t) => s + t.amount, 0);
    const consumoCredito = mt
      .filter((t) => t.flow_type === 'EGRESO' && t.instrument === 'CREDITO')
      .reduce((s, t) => s + t.amount, 0);
    const gastoHormiga = mt
      .filter((t) => t.flow_type === 'EGRESO' && t.necessity_level === 'Gasto Hormiga')
      .reduce((s, t) => s + t.amount, 0);
    return { ...m, ingresos, consumoDebito, consumoCredito, consumoTotal: consumoDebito + consumoCredito, gastoHormiga, txCount: mt.length };
  });

  const balanceCuenta = saldoAcumuladoCuenta;
  const liquidezLibrePostReservaTC = balanceCuenta - reservarNov;
  const colchonSeguridad = 150000;
  const capitalDisponibleFintual = Math.max(0, liquidezLibrePostReservaTC - colchonSeguridad);

  const enrichedPos = localFintualPositions.map((p) => {
    const costBasisUsd = Number((p.shares * p.avg_buy_price_usd).toFixed(2));
    const marketValueUsd = Number((p.shares * p.current_price_usd).toFixed(2));
    const marketValueClp = Math.round(marketValueUsd * usdRate);
    const pnlUsd = Number((marketValueUsd - costBasisUsd).toFixed(2));
    const pnlClp = Math.round(pnlUsd * usdRate);
    const pnlPct = costBasisUsd > 0 ? Number(((pnlUsd / costBasisUsd) * 100).toFixed(2)) : 0;
    return { ...p, costBasisUsd, marketValueUsd, marketValueClp, pnlUsd, pnlClp, pnlPct };
  });
  const totalPortfolioUsd = Number(enrichedPos.reduce((s, p) => s + p.marketValueUsd, 0).toFixed(2));
  const totalCostUsd = Number(enrichedPos.reduce((s, p) => s + p.costBasisUsd, 0).toFixed(2));
  const totalPnlUsd = Number((totalPortfolioUsd - totalCostUsd).toFixed(2));

  return {
    connectedAccount: 'Gmail Protegido (Token 24/7)',
    periodInfo,
    realtimeConfig: { lastSyncTimestamp: new Date().toISOString() },
    counts: {
      total: txs.length,
      allHistoryTotal: allTxs.length,
      gmailRealCount: txs.length,
      simuladoCount: 0
    },
    transactions: txs,
    globalDashboard: {
      kpis: {
        totalIngresos: debAudit.kpis.totalIngresos,
        totalIngresosAcumulados: allDebIng,
        totalConsumoRealConsolidado: globalBase.kpis.totalEgresos,
        totalConsumoDebito: globalBase.kpis.totalEgresos - credAudit.kpis.totalEgresos,
        totalConsumoCredito: credAudit.kpis.totalEgresos,
        balanceCuentaCorriente: balanceCuenta,
        reservaTarjetaNoviembre: reservarNov,
        liquidezLibrePostReservaTC,
        colchonSeguridad,
        capitalDisponibleFintual
      },
      semaphore: globalBase.semaphore,
      monthlyComparison,
      topCategories: globalBase.topCategories,
      topMerchants: globalBase.topMerchants,
      recurringMerchants: globalBase.recurringMerchants
    },
    audit: {
      DEBITO_CUENTA: debAudit,
      CREDITO: credAudit
    },
    fintual: {
      usdRate,
      contractStatus: 'ACTIVO · Enrutamiento de Órdenes Fintual Acciones (DriveWealth / NYSE & NASDAQ)',
      portfolioSummary: {
        totalPortfolioUsd,
        totalPortfolioClp: Math.round(totalPortfolioUsd * usdRate),
        totalCostUsd,
        totalPnlUsd,
        totalPnlClp: Math.round(totalPnlUsd * usdRate),
        totalPnlPct: totalCostUsd > 0 ? Number(((totalPnlUsd / totalCostUsd) * 100).toFixed(2)) : 0,
        positionsCount: enrichedPos.length
      },
      liquidityBridge: {
        balanceCuentaCorrienteClp: balanceCuenta,
        reservaTarjetaCreditoNovClp: reservarNov,
        liquidezPostTarjetaClp: liquidezLibrePostReservaTC,
        colchonSeguridadClp: colchonSeguridad,
        capitalDisponibleInvertirHoyClp: capitalDisponibleFintual,
        capitalDisponibleInvertirHoyUsd: Number((capitalDisponibleFintual / usdRate).toFixed(2)),
        potencialAhorroNoEsencialMensualClp: globalBase.semaphore.noEsencialTotal.potentialMonthlySavings,
        potencialAhorroNoEsencialMensualUsd: Number((globalBase.semaphore.noEsencialTotal.potentialMonthlySavings / usdRate).toFixed(2))
      },
      positions: enrichedPos.map((p) => ({
        ...p,
        actualWeightPct: totalPortfolioUsd > 0 ? Math.round((p.marketValueUsd / totalPortfolioUsd) * 100) : 0
      })),
      signals: localFintualSignals
    },
    rules: localRules
  };
}

function showToast(title, message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<div style="font-weight:700; margin-bottom:2px;">${title}</div><div style="color:var(--text-secondary);">${message}</div>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 4500);
}

async function fetchState() {
  // 1. Si el usuario configuró su URL 24/7 de Google Apps Script + Token Secreto, sincronizar desde la nube
  const cloudUrl = localStorage.getItem('bch_cloud_worker_url');
  const cloudToken = localStorage.getItem('bch_cloud_worker_token') || '';
  if (cloudUrl) {
    try {
      const sep = cloudUrl.includes('?') ? '&' : '?';
      const authUrl = `${cloudUrl}${sep}token=${encodeURIComponent(cloudToken)}`;
      const res = await fetch(authUrl);
      const cloudData = await res.json();
      if (cloudData.ok && Array.isArray(cloudData.transactions)) {
        const existingIds = new Set(localTransactions.map((t) => t.gmail_message_id));
        let added = 0;
        for (const tx of cloudData.transactions) {
          if (!existingIds.has(tx.gmail_message_id)) {
            localTransactions.unshift(tx);
            existingIds.add(tx.gmail_message_id);
            added++;
          }
        }
        if (added > 0) {
          saveLocalState();
          showToast('☁️ Nuevos Correos Mi Cuenta (24/7)', `Se incorporaron ${added} movimiento(s) verificados con tu Token.`);
        }
      }
    } catch (e) {
      console.warn('Cloud Worker sync warning:', e.message);
    }
  }

  // 2. Si el backend Node.js local está corriendo (y no estamos en APK nativo file: ni GitHub Pages), sincronizar
  const isNativeApk = window.location.protocol === 'file:';
  const isGithubPages = window.location.hostname.includes('github.io');
  if (!isNativeApk && !isGithubPages) {
    try {
      const res = await fetch('./api/state?source=ALL');
      if (res.ok) {
        const serverData = await res.json();
        if (Array.isArray(serverData.transactions) && serverData.transactions.length > 0) {
          localTransactions = serverData.transactions;
        }
        if (Array.isArray(serverData.rules)) {
          localRules = serverData.rules;
        }
        if (serverData.fintual?.positions) {
          localFintualPositions = serverData.fintual.positions;
        }
        if (serverData.fintual?.signals) {
          localFintualSignals = serverData.fintual.signals;
        }
        saveLocalState();
      }
    } catch {}
  }

  appState = buildClientSideState();
  updateRealtimeBadge(appState.realtimeConfig?.lastSyncTimestamp);
  renderDashboard();
}

function updateRealtimeBadge(isoTimestamp) {
  const el = document.getElementById('realtime-status-badge');
  if (!el) return;
  const d = isoTimestamp ? new Date(isoTimestamp) : new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const hasCloud = Boolean(localStorage.getItem('bch_cloud_worker_url'));
  const isNativeApk = window.location.protocol === 'file:';
  el.textContent = hasCloud
    ? `Nube 24/7 Activa · ${hh}:${mm}:${ss}`
    : isNativeApk
      ? `App Android Nativa · ${hh}:${mm}:${ss}`
      : `En Vivo · ${hh}:${mm}:${ss}`;
}

function initSSE() {
  if (!window.EventSource || window.location.protocol === 'file:' || window.location.hostname.includes('github.io')) {
    setInterval(() => {
      if (localStorage.getItem('bch_cloud_worker_url')) {
        fetchState();
      }
    }, 45000);
    return;
  }
  try {
    const es = new EventSource('./api/stream');
    es.addEventListener('new_email', (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        const tx = payload.transaction;
        showToast(
          '⚡ Nueva Transacción Mi Cuenta en Tiempo Real',
          `${tx.merchant} · ${formatCLP(tx.amount)} (${tx.necessity_level})`
        );
        fetchState();
      } catch {}
    });
    es.addEventListener('fintual_signal', (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        const sig = payload.signal;
        showToast(
          `📈 Señal del Agente Fintual: ${sig.action_type} ${sig.ticker}`,
          `${formatCLP(sig.suggested_amount_clp)} (${formatUSD(sig.suggested_amount_usd)}) · Confianza ${sig.confidence_pct}%`
        );
        fetchState();
      } catch {}
    });
    es.addEventListener('heartbeat_sync', (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        updateRealtimeBadge(payload.lastSyncTimestamp);
      } catch {}
    });
    es.addEventListener('state_updated', () => fetchState());
  } catch {}
}

function switchInstrumentTab(tab) {
  activeTab = tab;

  const tabMap = {
    DASHBOARD: ['tab-btn-dashboard', 'mob-tab-dashboard'],
    DEBITO_CUENTA: ['tab-btn-debito', 'mob-tab-debito'],
    CREDITO: ['tab-btn-credito', 'mob-tab-credito'],
    FINTUAL: ['tab-btn-fintual', 'mob-tab-fintual']
  };

  Object.entries(tabMap).forEach(([key, [deskId, mobId]]) => {
    const deskEl = document.getElementById(deskId);
    const mobEl = document.getElementById(mobId);
    if (deskEl) deskEl.classList.toggle('active', key === tab);
    if (mobEl) mobEl.classList.toggle('btn-primary', key === tab);
  });

  renderDashboard();
}

function setMonthFilter(monthKey) {
  if (monthKey === 'ALL') {
    setPeriodScope('SEMESTER');
    return;
  }
  if (monthKey === '2026-11' && activePeriodScope !== 'CURRENT_MONTH' && activePeriodScope !== 'MONTH') {
    setPeriodScope('CURRENT_MONTH');
    return;
  }
  activePeriodScope = 'MONTH';
  selectedMonthKey = monthKey;
  appState = buildClientSideState();
  renderDashboard();
}

function setRankingMode(mode) {
  activeRankingMode = mode;
  document.getElementById('rank-tab-recurring').classList.toggle('active', mode === 'RECURRING');
  document.getElementById('rank-tab-categories').classList.toggle('active', mode === 'CATEGORIES');
  document.getElementById('rank-tab-merchants').classList.toggle('active', mode === 'MERCHANTS');
  renderRankingPanel();
}

function setNecessityFilter(filter) {
  activeNecessityFilter = filter;
  const ids = {
    ALL: 'filter-all',
    Necesario: 'filter-necesario',
    'Opcional / Prescindible': 'filter-opcional',
    'Gasto Hormiga': 'filter-hormiga',
    Ingreso: 'filter-ingreso'
  };
  Object.entries(ids).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active', key === filter);
  });
  renderTransactionsList();
}

function handleSearchInput(val) {
  searchQuery = (val || '').toLowerCase().trim();
  renderTransactionsList();
}

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('bch_theme', next);
}

function renderDashboard() {
  if (!appState) return;

  renderPeriodSelectorBar();

  const debitoCount = appState.transactions.filter((t) => t.instrument === 'DEBITO_CUENTA').length;
  const creditoCount = appState.transactions.filter((t) => t.instrument === 'CREDITO').length;
  const fintualCount = appState.fintual?.positions?.length || 0;

  document.getElementById('real-email-counter').textContent = `${appState.counts.total} movs (${appState.periodInfo.shortLabel})`;
  document.getElementById('tab-count-dashboard').textContent = `${appState.counts.total} movs`;
  document.getElementById('tab-count-debito').textContent = `${debitoCount} movs`;
  document.getElementById('tab-count-credito').textContent = `${creditoCount} cargos`;
  document.getElementById('tab-count-fintual').textContent = `${fintualCount} activos`;

  const isFintual = activeTab === 'FINTUAL';
  document.getElementById('fintual-hub-section').style.display = isFintual ? 'flex' : 'none';
  document.getElementById('agent-alert-section').style.display = isFintual ? 'none' : 'flex';
  document.getElementById('analytics-grid-section').style.display = isFintual ? 'none' : 'grid';
  document.getElementById('movements-card-section').style.display = isFintual ? 'none' : 'flex';

  renderKpiSummary();
  renderGlobalMonthlyComparison();
  renderCreditBillingSection();

  if (isFintual) {
    renderFintualHub();
  } else {
    renderAgentAlert();
    renderSemaphorePanel();
    renderRankingPanel();
    renderTransactionsList();
  }
}

function getActiveAuditObject() {
  const pInfo = appState.periodInfo;
  if (activeTab === 'DASHBOARD') {
    const g = appState.globalDashboard;
    const noEs = g.semaphore.noEsencialTotal;
    const topRec = g.recurringMerchants[0];
    return {
      kpis: {
        totalEgresos: g.kpis.totalConsumoRealConsolidado
      },
      semaphore: g.semaphore,
      topCategories: g.topCategories,
      topMerchants: g.topMerchants,
      recurringMerchants: g.recurringMerchants,
      agentAlert: {
        severity: noEs.percentage >= 50 ? 'warning' : 'healthy',
        title: `Visión 360° (${pInfo.shortLabel}): ${noEs.percentage}% en gastos no esenciales`,
        message: `En ${pInfo.label}, sumando tu Cuenta/Débito ****0401 y tu Tarjeta de Crédito ****4114, has consumido ${formatCLP(g.kpis.totalConsumoRealConsolidado)} CLP reales, de los cuales ${formatCLP(noEs.amount)} CLP (${noEs.percentage}%) corresponden a gastos Opcionales y Gasto Hormiga.${topRec ? ` Tu comercio más repetido en este período es "${topRec.merchant}" (${topRec.count} veces por ${formatCLP(topRec.amount)} CLP).` : ''} Si recortas a la mitad los gastos no esenciales, liberarías ${formatCLP(noEs.potentialMonthlySavings)} CLP adicionales cada mes para Fintual Acciones.`,
        potentialMonthlySavings: noEs.potentialBimonthlySavings,
        potentialAnnualSavings: noEs.potentialAnnualSavings
      }
    };
  }
  return appState.audit[activeTab] || appState.audit.DEBITO_CUENTA;
}

function renderKpiSummary() {
  const grid = document.getElementById('kpi-summary-grid');
  const pInfo = appState.periodInfo;

  if (activeTab === 'DASHBOARD') {
    const gk = appState.globalDashboard.kpis;
    const isNovOnly = pInfo.key === '2026-11';
    const ingFootnote = isNovOnly && gk.totalIngresos === 0
      ? `Sueldo +$899.346 abonado el 30/10 · Saldo Cta disponible: +${formatCLP(gk.balanceCuentaCorriente)}`
      : `Abonos recibidos en Cuenta ****0401 en ${pInfo.shortLabel}`;

    grid.innerHTML = `
      <article class="kpi-card">
        <div class="kpi-header">
          <span>Ingresos (${pInfo.shortLabel})</span>
          <span>▲ Cuenta ****0401</span>
        </div>
        <div class="kpi-value mono positive">+${formatCLP(gk.totalIngresos)}</div>
        <div class="kpi-footnote">${ingFootnote}</div>
      </article>

      <article class="kpi-card">
        <div class="kpi-header">
          <span>Consumo Real (${pInfo.shortLabel})</span>
          <span>▼ Débito + TC</span>
        </div>
        <div class="kpi-value mono negative">-${formatCLP(gk.totalConsumoRealConsolidado)}</div>
        <div class="kpi-footnote">Débito: ${formatCLP(gk.totalConsumoDebito)} · Crédito: ${formatCLP(gk.totalConsumoCredito)}</div>
      </article>

      <article class="kpi-card" style="border-color: var(--amber-border);">
        <div class="kpi-header">
          <span style="color:var(--amber);">💰 Reserva Pago T. Crédito (Nov)</span>
          <span>Tarjeta ****4114</span>
        </div>
        <div class="kpi-value mono" style="color:var(--amber);">${formatCLP(gk.reservaTarjetaNoviembre)}</div>
        <div class="kpi-footnote">Dinero que debes apartar para pagar la facturación de Noviembre</div>
      </article>

      <article class="kpi-card" style="border-color: var(--emerald-border);">
        <div class="kpi-header">
          <span style="color:var(--emerald);">📈 Liquidez Libre Post-Reserva TC</span>
          <span>Lista p/ Fintual</span>
        </div>
        <div class="kpi-value mono positive">+${formatCLP(gk.liquidezLibrePostReservaTC)}</div>
        <div class="kpi-footnote">Saldo Cta (${formatCLP(gk.balanceCuentaCorriente)}) menos reserva TC (${formatCLP(gk.reservaTarjetaNoviembre)})</div>
      </article>
    `;
  } else if (activeTab === 'DEBITO_CUENTA') {
    const kpis = appState.audit.DEBITO_CUENTA.kpis;
    const isNovOnly = pInfo.key === '2026-11';
    const ingFootnote = isNovOnly && kpis.totalIngresos === 0
      ? `Sueldo REM +$899.346 abonado el 30/10 para financiar Noviembre`
      : `Remuneración, honorarios y transferencias en ${pInfo.shortLabel}`;

    grid.innerHTML = `
      <article class="kpi-card">
        <div class="kpi-header">
          <span>Saldo Disponible Cuenta ****0401</span>
          <span>Acumulado Real</span>
        </div>
        <div class="kpi-value mono positive">+${formatCLP(kpis.saldoAcumuladoCuenta)}</div>
        <div class="kpi-footnote">Flujo neto en ${pInfo.shortLabel}: ${kpis.saldoNetoMes >= 0 ? '+' : ''}${formatCLP(kpis.saldoNetoMes)}</div>
      </article>

      <article class="kpi-card">
        <div class="kpi-header">
          <span>Ingresos / Abonos (${pInfo.shortLabel})</span>
          <span>▲ Cuenta ****0401</span>
        </div>
        <div class="kpi-value mono positive">+${formatCLP(kpis.totalIngresos)}</div>
        <div class="kpi-footnote">${ingFootnote}</div>
      </article>

      <article class="kpi-card">
        <div class="kpi-header">
          <span>Compras con Débito (${pInfo.shortLabel})</span>
          <span>▼ ${kpis.cantidadComprasComercio} compras</span>
        </div>
        <div class="kpi-value mono negative">-${formatCLP(kpis.totalComprasDebito)}</div>
        <div class="kpi-footnote">Comercios, supermercados, cafetería y giros ATM</div>
      </article>

      <article class="kpi-card">
        <div class="kpi-header">
          <span>Transferencias y Pago TC (${pInfo.shortLabel})</span>
          <span>⇄ TEF + Pago TC</span>
        </div>
        <div class="kpi-value mono negative">-${formatCLP(kpis.totalTransferencias)}</div>
        <div class="kpi-footnote">Transferencias a terceros y pagos de Tarjeta ****4114</div>
      </article>
    `;
  } else if (activeTab === 'CREDITO') {
    const audit = appState.audit.CREDITO;
    const kpis = audit.kpis;
    const mb = audit.monthlyBilling;
    const toReserveNov = mb ? mb.currentCycle.totalToReserve : kpis.proyeccionFacturacion;
    const novPurchases = mb ? mb.currentCycle.purchasesThisMonth : 164146;

    grid.innerHTML = `
      <article class="kpi-card" style="border-color: var(--amber-border); background: linear-gradient(180deg, var(--amber-soft), var(--bg-surface));">
        <div class="kpi-header">
          <span style="color: var(--amber); font-weight:700;">💰 A Reservar Este Mes (Nov)</span>
          <span>Para Pagar TC</span>
        </div>
        <div class="kpi-value mono" style="color: var(--amber);">${formatCLP(toReserveNov)}</div>
        <div class="kpi-footnote">${formatCLP(novPurchases)} compras Nov + $37.207 saldo post-pago 30/10</div>
      </article>

      <article class="kpi-card">
        <div class="kpi-header">
          <span>Compras en ${pInfo.shortLabel}</span>
          <span>${kpis.cantidadCompras} cargos</span>
        </div>
        <div class="kpi-value mono negative">${formatCLP(kpis.totalEgresos)}</div>
        <div class="kpi-footnote">Gasto con Tarjeta ****4114 en el período seleccionado</div>
      </article>

      <article class="kpi-card">
        <div class="kpi-header">
          <span>Facturado y Pagado Octubre</span>
          <span>Pagado 30/10</span>
        </div>
        <div class="kpi-value mono positive">$157.756</div>
        <div class="kpi-footnote">Pagado desde Cta. ****0401 (Total compras Oct: $272.853)</div>
      </article>

      <article class="kpi-card">
        <div class="kpi-header">
          <span>Acumulado 2° Semestre / Año</span>
          <span>Crédito ****4114</span>
        </div>
        <div class="kpi-value mono">${formatCLP(mb ? mb.totalHistoryAmount : kpis.totalEgresos)}</div>
        <div class="kpi-footnote">${mb ? mb.totalHistoryCount : kpis.cantidadCompras} compras totales en el historial</div>
      </article>
    `;
  } else if (activeTab === 'FINTUAL') {
    const f = appState.fintual;
    const ps = f.portfolioSummary;
    const lb = f.liquidityBridge;
    const pnlClass = ps.totalPnlUsd >= 0 ? 'positive' : 'negative';

    grid.innerHTML = `
      <article class="kpi-card">
        <div class="kpi-header">
          <span>Valor Portafolio Fintual Acciones</span>
          <span>TC $${f.usdRate} CLP/USD</span>
        </div>
        <div class="kpi-value mono">${formatUSD(ps.totalPortfolioUsd)}</div>
        <div class="kpi-footnote">Equivalente a <strong>${formatCLP(ps.totalPortfolioClp)} CLP</strong> en ${ps.positionsCount} activos US</div>
      </article>

      <article class="kpi-card">
        <div class="kpi-header">
          <span>Rentabilidad Acumulada (PnL)</span>
          <span>NYSE / NASDAQ</span>
        </div>
        <div class="kpi-value mono ${pnlClass}">${ps.totalPnlUsd >= 0 ? '+' : ''}${formatUSD(ps.totalPnlUsd)} (${ps.totalPnlPct >= 0 ? '+' : ''}${ps.totalPnlPct}%)</div>
        <div class="kpi-footnote">Ganancia latente: ${ps.totalPnlClp >= 0 ? '+' : ''}${formatCLP(ps.totalPnlClp)} CLP</div>
      </article>

      <article class="kpi-card" style="border-color: var(--emerald-border);">
        <div class="kpi-header">
          <span style="color:var(--emerald);">Capital Disponible para Invertir Hoy</span>
          <span>Puente BCH → Fintual</span>
        </div>
        <div class="kpi-value mono positive">${formatCLP(lb.capitalDisponibleInvertirHoyClp)}</div>
        <div class="kpi-footnote">Equivalente a <strong>${formatUSD(lb.capitalDisponibleInvertirHoyUsd)}</strong> (tras reservar TC y colchón)</div>
      </article>

      <article class="kpi-card" style="border-color: var(--bch-royal);">
        <div class="kpi-header">
          <span>Potencial Extra Recortando Hormiga</span>
          <span>DCA Mensual</span>
        </div>
        <div class="kpi-value mono" style="color:var(--bch-royal-hover);">+${formatCLP(lb.potencialAhorroNoEsencialMensualClp)}/mes</div>
        <div class="kpi-footnote">+${formatUSD(lb.potencialAhorroNoEsencialMensualUsd)}/mes extra reduciendo 50% gastos no esenciales</div>
      </article>
    `;
  }
}

function renderGlobalMonthlyComparison() {
  const section = document.getElementById('global-monthly-comparison-section');
  if (!section) return;

  if (activeTab !== 'DASHBOARD' || !appState?.globalDashboard?.monthlyComparison) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'flex';
  const months = appState.globalDashboard.monthlyComparison;
  const maxVal = Math.max(...months.map((m) => Math.max(m.ingresos, m.consumoTotal, 1)));
  const pInfo = appState.periodInfo;

  const cardsHtml = months
    .map((m) => {
      const isSelected = (pInfo.scope === 'CURRENT_MONTH' || pInfo.scope === 'MONTH') && pInfo.key === m.key;
      const ingPct = Math.round((m.ingresos / maxVal) * 100);
      const debPct = Math.round((m.consumoDebito / maxVal) * 100);
      const credPct = Math.round((m.consumoCredito / maxVal) * 100);

      return `
        <div
          onclick="setMonthFilter('${m.key}')"
          style="cursor:pointer; background:var(--bg-elevated); border-radius:var(--radius-sm); padding:14px; display:flex; flex-direction:column; gap:8px; border:${
            isSelected ? '2px solid var(--bch-royal)' : '1px solid var(--border-subtle)'
          };"
        >
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:14px; font-weight:700;">${m.label}</span>
            <span class="badge ${isSelected ? 'badge-gmail' : 'badge-demo'} mono">${m.txCount} movs</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:6px; font-size:12px;">
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                <span style="color:var(--text-secondary);">Ingresos Cuenta:</span>
                <span class="mono" style="color:var(--emerald); font-weight:700;">+${formatCLP(m.ingresos)}</span>
              </div>
              <div class="rank-bar-bg"><div style="height:100%; width:${ingPct}%; background:var(--emerald); border-radius:999px;"></div></div>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                <span style="color:var(--text-secondary);">Consumo Débito (****0401):</span>
                <span class="mono" style="color:var(--text-primary); font-weight:600;">-${formatCLP(m.consumoDebito)}</span>
              </div>
              <div class="rank-bar-bg"><div style="height:100%; width:${Math.max(4, debPct)}%; background:var(--bch-royal); border-radius:999px;"></div></div>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                <span style="color:var(--text-secondary);">Compras Crédito (****4114):</span>
                <span class="mono" style="color:var(--amber); font-weight:600;">-${formatCLP(m.consumoCredito)}</span>
              </div>
              <div class="rank-bar-bg"><div style="height:100%; width:${Math.max(4, credPct)}%; background:var(--amber); border-radius:999px;"></div></div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:6px; border-top:1px solid var(--border-subtle); font-size:12px;">
            <span style="color:var(--text-muted);">Gasto Hormiga del mes: <strong class="mono" style="color:var(--crimson);">${formatCLP(m.gastoHormiga)}</strong></span>
            <span style="font-size:11px; color:var(--bch-royal-hover); font-weight:600;">
              ${isSelected ? '✓ Viendo este mes' : 'Ver mes →'}
            </span>
          </div>
        </div>
      `;
    })
    .join('');

  section.innerHTML = `
    <div class="panel-header">
      <div>
        <h2 class="panel-title">📊 Comparativa Mensual Interactiva (Sep · Oct · Nov 2026)</h2>
        <p class="panel-subtitle">Por defecto estás viendo el <strong>Mes Actual (Noviembre 2026)</strong>. Toca cualquier mes o usa el selector superior para ver Por Semestre o Por Año.</p>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${
          pInfo.scope === 'CURRENT_MONTH' || pInfo.scope === 'MONTH'
            ? `<button class="btn" onclick="setPeriodScope('SEMESTER')">Ver Consolidado Semestral</button>`
            : `<button class="btn btn-primary" onclick="setPeriodScope('CURRENT_MONTH')">Volver al Mes Actual (Nov)</button>`
        }
      </div>
    </div>
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(265px, 1fr)); gap:12px;">
      ${cardsHtml}
    </div>
  `;
}

function renderCreditBillingSection() {
  const section = document.getElementById('credit-billing-reservation-section');
  if (!section) return;

  if (activeTab !== 'CREDITO' || !appState?.audit?.CREDITO?.monthlyBilling) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'flex';
  const mb = appState.audit.CREDITO.monthlyBilling;
  const cur = mb.currentCycle;
  const pInfo = appState.periodInfo;

  const monthCardsHtml = mb.months
    .map((m) => {
      const isSelected = (pInfo.scope === 'CURRENT_MONTH' || pInfo.scope === 'MONTH') && pInfo.key === m.monthKey;
      const isPending = m.status === 'POR_PAGAR';
      const borderStyle = isSelected
        ? 'border: 2px solid var(--bch-royal);'
        : isPending
          ? 'border: 1px solid var(--amber-border);'
          : 'border: 1px solid var(--border-subtle);';

      return `
        <div
          onclick="setMonthFilter('${m.monthKey}')"
          style="cursor:pointer; background:var(--bg-elevated); border-radius:var(--radius-sm); padding:14px; display:flex; flex-direction:column; gap:6px; ${borderStyle}"
        >
          <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; flex-wrap:wrap;">
            <span style="font-size:14px; font-weight:700; color:var(--text-primary);">${m.label}</span>
            <span class="badge ${isPending ? 'badge-opcional' : 'badge-necesario'}">${m.statusBadge}</span>
          </div>

          <div style="font-size:11.5px; color:var(--text-secondary);">${m.subLabel}</div>

          <div style="display:flex; justify-content:space-between; align-items:baseline; padding-top:4px; border-top:1px solid var(--border-subtle);">
            <span style="font-size:12px; color:var(--text-secondary);">${
              isPending ? 'Monto a Reservar:' : 'Monto Facturado/Pagado:'
            }</span>
            <span class="mono" style="font-size:18px; font-weight:700; color:${
              isPending ? 'var(--amber)' : 'var(--emerald)'
            };">${formatCLP(m.billedOrToReserve)}</span>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-secondary);">
            <span>Compras realizadas en el mes (${m.purchasesCount}):</span>
            <span class="mono" style="font-weight:600; color:var(--text-primary);">${formatCLP(m.purchasesAmount)}</span>
          </div>

          <div style="font-size:11.5px; color:var(--text-muted); line-height:1.4;">
            ${m.note}
          </div>

          <div style="font-size:11px; color:var(--bch-royal-hover); font-weight:600; padding-top:2px;">
            ${isSelected ? '✓ Viendo compras de ' + m.label : '→ Toca para ver compras de ' + m.label}
          </div>
        </div>
      `;
    })
    .join('');

  section.innerHTML = `
    <div class="panel-header">
      <div>
        <h2 class="panel-title">📌 Planificador de Facturación Mensual y Reserva de Pago · Tarjeta ****4114</h2>
        <p class="panel-subtitle">
          Conciliado con tus correos reales de <em>"Estado de Cuenta"</em> (corte día ~23) y <em>"Pago de Tarjeta de Crédito Nacional"</em>
        </p>
      </div>
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        ${
          pInfo.scope === 'CURRENT_MONTH' || pInfo.scope === 'MONTH'
            ? `<button class="btn" onclick="setPeriodScope('SEMESTER')">Ver Todos los Meses (Semestre)</button>`
            : `<button class="btn btn-primary" onclick="setPeriodScope('CURRENT_MONTH')">Ver Solo Mes Actual (Nov)</button>`
        }
        <span class="badge badge-opcional mono" style="font-size:12.5px; padding:5px 10px;">
          Reservar en Noviembre: ${formatCLP(cur.totalToReserve)} CLP
        </span>
      </div>
    </div>

    <div style="background:var(--bg-elevated); border:1px solid var(--amber-border); border-radius:var(--radius-sm); padding:13px 15px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px;">
      <div style="display:flex; flex-direction:column; gap:3px;">
        <span style="font-size:13px; font-weight:700; color:var(--text-primary);">
          💡 ¿Cuánto dinero debes apartar este mes para pagar tu Tarjeta de Crédito?
        </span>
        <span style="font-size:12.5px; color:var(--text-secondary);">
          Llevas <strong>${formatCLP(cur.purchasesThisMonth)} CLP</strong> en ${cur.purchasesCount} compras realizadas en Noviembre + <strong>${formatCLP(cur.carryOverFromLastCut)} CLP</strong> de saldo remanente tras tu pago del 30/10 ($194.963 utilizado menos $157.756 pagado).
        </span>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--text-muted); font-weight:600;">Total a Reservar (Corte ~23 Nov)</div>
        <div class="mono" style="font-size:22px; font-weight:700; color:var(--amber);">${formatCLP(cur.totalToReserve)} CLP</div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(265px, 1fr)); gap:12px;">
      ${monthCardsHtml}
    </div>
  `;
}

function renderFintualHub() {
  const container = document.getElementById('fintual-hub-section');
  if (!container || !appState?.fintual) return;

  const f = appState.fintual;
  const lb = f.liquidityBridge;

  const positionsHtml = f.positions
    .map((p) => {
      const isGain = p.pnlUsd >= 0;
      return `
        <div style="background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:13px; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="mono" style="font-size:15px; font-weight:700; color:var(--text-primary);">${p.ticker}</span>
              <span class="badge badge-gmail">${p.asset_type}</span>
            </div>
            <span class="mono" style="font-size:14px; font-weight:700;">${formatUSD(p.marketValueUsd)}</span>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-secondary);">
            <span>${p.name}</span>
            <span class="mono">${formatCLP(p.marketValueClp)} CLP</span>
          </div>

          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:6px; padding-top:6px; border-top:1px solid var(--border-subtle); font-size:11.5px;">
            <div>
              <span style="color:var(--text-muted); display:block;">Acciones</span>
              <strong class="mono">${p.shares}</strong>
            </div>
            <div>
              <span style="color:var(--text-muted); display:block;">Compra / Actual</span>
              <strong class="mono">$${p.avg_buy_price_usd} → $${p.current_price_usd}</strong>
            </div>
            <div style="text-align:right;">
              <span style="color:var(--text-muted); display:block;">Retorno</span>
              <strong class="mono" style="color:${isGain ? 'var(--emerald)' : 'var(--crimson)'};">
                ${isGain ? '+' : ''}${p.pnlPct}% (${isGain ? '+' : ''}$${p.pnlUsd})
              </strong>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); padding-top:2px;">
            <span>Peso actual: <strong class="mono">${p.actualWeightPct}%</strong> (Objetivo Agente: ${p.target_weight_pct}%)</span>
            <span>${p.notes || ''}</span>
          </div>
        </div>
      `;
    })
    .join('');

  const signalsHtml = f.signals
    .map((s) => {
      const badgeClass =
        s.action_type === 'BUY' || s.action_type === 'DCA'
          ? 'badge-necesario'
          : s.action_type === 'SELL'
            ? 'badge-hormiga'
            : 'badge-opcional';
      return `
        <div style="background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:13px; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge ${badgeClass} mono">${s.action_type} ${s.ticker}</span>
              <span class="mono" style="font-size:13.5px; font-weight:700;">${formatCLP(s.suggested_amount_clp)} CLP (${formatUSD(s.suggested_amount_usd)})</span>
            </div>
            <span class="badge badge-gmail mono">Confianza IA: ${s.confidence_pct}%</span>
          </div>
          <p style="font-size:12.5px; color:var(--text-primary);">${s.reasoning}</p>
          <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted);">
            <span>🔗 Fuente de Liquidez: ${s.source_liquidity_note}</span>
            <span class="mono">Agente: ${s.agent_id}</span>
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = `
    <article class="panel-card">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">🌉 Puente de Liquidez en Tiempo Real: Mi Cuenta → Fintual Acciones</h2>
          <p class="panel-subtitle">${f.contractStatus}</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn" onclick="openFintualPosModal()">+ Agregar / Editar Acción</button>
          <button class="btn btn-primary" onclick="simulateInvestmentAgentSignal()">⚡ Simular Señal del Agente Inversiones</button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:10px; background:var(--bg-elevated); padding:14px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
        <div>
          <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:600;">1. Balance Cuenta ****0401</div>
          <div class="mono" style="font-size:17px; font-weight:700; color:var(--emerald);">+${formatCLP(lb.balanceCuentaCorrienteClp)}</div>
        </div>
        <div>
          <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:600;">2. Menos Reserva Pago TC ****4114</div>
          <div class="mono" style="font-size:17px; font-weight:700; color:var(--amber);">-${formatCLP(lb.reservaTarjetaCreditoNovClp)}</div>
        </div>
        <div>
          <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:600;">3. Menos Colchón Emergencia</div>
          <div class="mono" style="font-size:17px; font-weight:700; color:var(--text-secondary);">-${formatCLP(lb.colchonSeguridadClp)}</div>
        </div>
        <div style="border-left: 2px solid var(--emerald); padding-left:12px;">
          <div style="font-size:11px; color:var(--emerald); text-transform:uppercase; font-weight:700;">= Capital Transferible a Fintual Hoy</div>
          <div class="mono" style="font-size:18px; font-weight:700; color:var(--emerald);">
            ${formatCLP(lb.capitalDisponibleInvertirHoyClp)} (${formatUSD(lb.capitalDisponibleInvertirHoyUsd)})
          </div>
        </div>
      </div>
    </article>

    <div class="analytics-grid">
      <article class="panel-card">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">📈 Portafolio Fintual Acciones (NYSE / NASDAQ)</h2>
            <p class="panel-subtitle">Posiciones actuales en dólares y peso objetivo para el Agente de Inversiones</p>
          </div>
          <span class="badge badge-necesario mono">Dólar Fintual: $${f.usdRate} CLP</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${positionsHtml}
        </div>
      </article>

      <article class="panel-card">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">🤖 Bandeja de Órdenes y Señales del Agente de Inversiones</h2>
            <p class="panel-subtitle">Alimentada vía <code>POST /api/fintual/agent-signal</code> usando tu liquidez real del Mi Cuenta</p>
          </div>
          <span class="badge badge-gmail mono">${f.signals.length} señales</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${signalsHtml}
        </div>

        <div style="border-top:1px solid var(--border-subtle); padding-top:10px; font-size:11.5px; color:var(--text-secondary);">
          <div style="font-weight:700; margin-bottom:4px; color:var(--text-primary);">🔌 Endpoints listos para tu Segundo Agente (Agente de Inversiones Fintual):</div>
          <div class="mono" style="background:var(--bg-page); padding:8px 10px; border-radius:6px; border:1px solid var(--border-subtle); font-size:11px; line-height:1.5;">
            GET  /api/fintual/context       → Lee liquidez libre post-TC, ahorro hormiga y portafolio<br/>
            POST /api/fintual/agent-signal  → Publica orden BUY/DCA/REBALANCE en tiempo real<br/>
            POST /api/fintual/positions     → Actualiza acciones fraccionadas y precios en USD
          </div>
        </div>
      </article>
    </div>
  `;
}

function renderAgentAlert() {
  const audit = getActiveAuditObject();
  const alertObj = audit.agentAlert;
  const section = document.getElementById('agent-alert-section');
  const pInfo = appState.periodInfo;

  section.className = `agent-alert-banner ${alertObj.severity}`;
  section.innerHTML = `
    <div class="agent-alert-top">
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <span class="agent-badge">🤖 Auditoría del Agente IA · ${pInfo.shortLabel}</span>
        <h3 class="agent-alert-title">${alertObj.title}</h3>
      </div>
      <span class="mono" style="font-size:12px; color:var(--text-secondary);">
        Ahorro potencial 50%: <strong style="color:var(--emerald);">${formatCLP(alertObj.potentialMonthlySavings)} en ${pInfo.shortLabel}</strong>
      </span>
    </div>
    <p class="agent-alert-message">${alertObj.message}</p>
    <div class="savings-highlight-row">
      <span>Proyección anual transferible a Fintual Acciones reduciendo 50% gastos no esenciales: <span class="savings-chip mono">${formatCLP(alertObj.potentialAnnualSavings)} CLP/año</span></span>
      <span>·</span>
      <span>Período activo: <strong>${pInfo.label}</strong></span>
    </div>
  `;
}

function renderSemaphorePanel() {
  const audit = getActiveAuditObject();
  const sem = audit.semaphore;
  const pInfo = appState.periodInfo;

  document.getElementById('semaphore-panel-title').textContent =
    activeTab === 'DASHBOARD'
      ? `Semáforo Financiero Consolidado · ${pInfo.shortLabel}`
      : `Auditoría de Necesidad · ${pInfo.shortLabel}`;

  document.getElementById('semaphore-total-badge').textContent =
    `Egresos (${pInfo.shortLabel}): ${formatCLP(audit.kpis.totalEgresos)}`;

  document.getElementById('sem-bar-green').style.width = `${sem.necesario.percentage}%`;
  document.getElementById('sem-bar-amber').style.width = `${sem.opcional.percentage}%`;
  document.getElementById('sem-bar-red').style.width = `${sem.hormiga.percentage}%`;

  const container = document.getElementById('semaphore-cards-container');
  container.innerHTML = `
    <div class="sem-item">
      <div class="sem-item-head">
        <span><span class="sem-dot green"></span> Necesario</span>
        <span class="mono" style="color:var(--emerald);">${sem.necesario.percentage}%</span>
      </div>
      <div class="sem-amount mono">${formatCLP(sem.necesario.amount)}</div>
      <div class="sem-meta">${sem.necesario.count} cargos esenciales</div>
    </div>

    <div class="sem-item">
      <div class="sem-item-head">
        <span><span class="sem-dot amber"></span> Opcional</span>
        <span class="mono" style="color:var(--amber);">${sem.opcional.percentage}%</span>
      </div>
      <div class="sem-amount mono">${formatCLP(sem.opcional.amount)}</div>
      <div class="sem-meta">${sem.opcional.count} gastos prescindibles</div>
    </div>

    <div class="sem-item">
      <div class="sem-item-head">
        <span><span class="sem-dot red"></span> Gasto Hormiga</span>
        <span class="mono" style="color:var(--crimson);">${sem.hormiga.percentage}%</span>
      </div>
      <div class="sem-amount mono">${formatCLP(sem.hormiga.amount)}</div>
      <div class="sem-meta">${sem.hormiga.count} micro-gastos repetitivos</div>
    </div>
  `;

  const rulesContainer = document.getElementById('rules-list-container');
  if (!appState.rules || appState.rules.length === 0) {
    rulesContainer.innerHTML = `<span style="font-size:12px; color:var(--text-muted);">Sin reglas manuales activas. Toca "⚙ Corregir IA" en cualquier movimiento para entrenar al agente.</span>`;
  } else {
    rulesContainer.innerHTML = appState.rules
      .map(
        (r, idx) => `
        <div class="rule-chip">
          <span><strong>"${r.merchant_pattern}"</strong> → ${r.assigned_necessity} (${r.assigned_category})</span>
          <button class="rule-del-btn" title="Eliminar regla" onclick="removeRule(${r.id || idx})">✕</button>
        </div>
      `
      )
      .join('');
  }
}

function renderRankingPanel() {
  const audit = getActiveAuditObject();
  const container = document.getElementById('ranking-list-container');

  let items = [];
  if (activeRankingMode === 'RECURRING') {
    items = audit.recurringMerchants || [];
  } else if (activeRankingMode === 'CATEGORIES') {
    items = audit.topCategories || [];
  } else {
    items = audit.topMerchants || [];
  }

  if (!items || items.length === 0) {
    container.innerHTML = `<p style="font-size:12.5px; color:var(--text-muted);">No hay datos registrados para este período.</p>`;
    return;
  }

  container.innerHTML = items
    .slice(0, 8)
    .map((item) => {
      const label = activeRankingMode === 'CATEGORIES' ? item.category : item.merchant;
      const avgTag = item.avgTicket ? ` · prom. ${formatCLP(item.avgTicket)}` : '';
      const sub = `${item.count}x${avgTag} (${item.percentage}%)`;
      return `
        <div class="rank-row">
          <div class="rank-row-top">
            <span class="rank-name">${label}</span>
            <span class="rank-val mono">${formatCLP(item.amount)} · ${sub}</span>
          </div>
          <div class="rank-bar-bg">
            <div class="rank-bar-fill" style="width: ${Math.max(5, item.percentage)}%"></div>
          </div>
        </div>
      `;
    })
    .join('');
}

function getNecessityBadgeClass(level) {
  if (level === 'Necesario') return 'badge-necesario';
  if (level === 'Opcional / Prescindible') return 'badge-opcional';
  if (level === 'Gasto Hormiga') return 'badge-hormiga';
  return 'badge-ingreso';
}

function renderTransactionsList() {
  const container = document.getElementById('transactions-list-container');
  const pInfo = appState.periodInfo;
  let list =
    activeTab === 'DASHBOARD'
      ? [...appState.transactions]
      : appState.transactions.filter((t) => t.instrument === activeTab);

  if (activeNecessityFilter !== 'ALL') {
    list = list.filter((t) => t.necessity_level === activeNecessityFilter);
  }

  if (searchQuery) {
    list = list.filter((t) => {
      const target = `${t.merchant} ${t.category} ${t.voucher_number || ''} ${t.ai_justification || ''}`.toLowerCase();
      return target.includes(searchQuery);
    });
  }

  const periodSuffix = ` · ${pInfo.label}`;
  document.getElementById('movements-shown-count').textContent = `${list.length} movimientos`;
  document.getElementById('movements-list-title').textContent =
    activeTab === 'DASHBOARD'
      ? `Flujo Unificado (Débito ****0401 + Crédito ****4114)${periodSuffix}`
      : activeTab === 'CREDITO'
        ? `Movimientos · Tarjeta de Crédito ****4114${periodSuffix}`
        : `Movimientos · Cuenta Corriente / Débito ****0401${periodSuffix}`;

  if (list.length === 0) {
    container.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-secondary); font-size:13px;">No se encontraron movimientos en <strong>${pInfo.label}</strong> con el filtro actual.</div>`;
    return;
  }

  container.innerHTML = list
    .map((tx) => {
      const isIngreso = tx.flow_type === 'INGRESO';
      const sign = isIngreso ? '+' : '-';
      const amountClass = isIngreso ? 'ingreso' : 'egreso';
      const instBadge =
        tx.instrument === 'CREDITO'
          ? `<span class="badge badge-cuotas mono">💳 TC ****4114</span>`
          : `<span class="badge badge-demo mono">🏦 Cta ****0401</span>`;

      const overriddenTag = tx.user_overridden ? ' · ★ Regla Usuario' : '';

      return `
        <article class="tx-card">
          <div class="tx-main">
            <div class="tx-title-row">
              <span class="tx-merchant">${tx.merchant}</span>
              ${instBadge}
              <span class="badge ${getNecessityBadgeClass(tx.necessity_level)}">
                ${tx.necessity_level}${overriddenTag}
              </span>
            </div>

            <div class="tx-meta-row">
              <span class="mono">📅 ${tx.display_date}</span>
              <span>·</span>
              <span>🏷 ${tx.category}</span>
              <span>·</span>
              <span class="mono" style="color:var(--text-muted);">Gmail ID: ${tx.gmail_message_id}</span>
            </div>

            <div class="tx-ai-line">
              <span>🤖 <em>${tx.ai_justification}</em></span>
            </div>
          </div>

          <div class="tx-right">
            <div class="tx-amount mono ${amountClass}">${sign}${formatCLP(tx.amount)} CLP</div>
            ${
              !isIngreso
                ? `<button class="btn-reclassify" onclick="openOverrideModal(${tx.id})">⚙ Corregir IA</button>`
                : `<span style="font-size:11px; color:var(--emerald);">Abono Verificado</span>`
            }
          </div>
        </article>
      `;
    })
    .join('');
}

async function triggerGmailSync() {
  const btn = document.getElementById('btn-sync-gmail');
  const prevText = btn.textContent;
  btn.textContent = '⟳...';
  btn.disabled = true;
  try {
    await fetchState();
    showToast('Sincronización Completada', 'Tus movimientos de Mi Cuenta y Fintual están al día.');
  } catch (err) {
    showToast('Aviso', err.message);
  } finally {
    btn.textContent = prevText;
    btn.disabled = false;
  }
}

function openOverrideModal(txId) {
  const tx = appState.transactions.find((t) => String(t.id) === String(txId));
  if (!tx) return;

  document.getElementById('override-tx-id').value = tx.id;
  document.getElementById('override-tx-summary').textContent =
    `${tx.merchant} · ${formatCLP(tx.amount)} CLP (${tx.display_date})`;
  document.getElementById('override-necessity-select').value =
    tx.necessity_level === 'Ingreso' ? 'Necesario' : tx.necessity_level;
  document.getElementById('override-category-select').value = tx.category;
  document.getElementById('override-custom-note').value = tx.ai_justification;
  document.getElementById('modal-override').classList.add('open');
}

function closeOverrideModal() {
  document.getElementById('modal-override').classList.remove('open');
}

async function submitOverrideForm() {
  const transactionId = document.getElementById('override-tx-id').value;
  const necessityLevel = document.getElementById('override-necessity-select').value;
  const category = document.getElementById('override-category-select').value;
  const customNote = document.getElementById('override-custom-note').value;
  const applyRuleToMerchant = document.getElementById('override-apply-rule').checked;

  // Intentar backend si está activo
  try {
    const res = await fetch('./api/override-necessity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId, necessityLevel, category, customNote, applyRuleToMerchant })
    });
    if (res.ok) {
      closeOverrideModal();
      await fetchState();
      return;
    }
  } catch {}

  // Actualizar en almacenamiento local de la PWA Android
  const target = localTransactions.find((t) => String(t.id) === String(transactionId));
  if (target) {
    const pattern = target.merchant.toLowerCase();
    let affected = 1;
    if (applyRuleToMerchant && pattern) {
      localRules = localRules.filter((r) => r.merchant_pattern !== pattern);
      localRules.push({
        id: Date.now(),
        merchant_pattern: pattern,
        assigned_necessity: necessityLevel,
        assigned_category: category
      });
      localTransactions.forEach((t) => {
        if (t.flow_type === 'EGRESO' && t.merchant.toLowerCase().includes(pattern)) {
          t.necessity_level = necessityLevel;
          t.category = category;
          t.ai_justification = customNote || `Clasificado como "${necessityLevel}" por tu regla personalizada.`;
          t.user_overridden = 1;
          affected++;
        }
      });
    } else {
      target.necessity_level = necessityLevel;
      target.category = category;
      target.ai_justification = customNote;
      target.user_overridden = 1;
    }
    saveLocalState();
    closeOverrideModal();
    showToast('Agente IA Entrenado', `Regla aplicada a ${affected} movimiento(s).`);
    await fetchState();
  }
}

async function removeRule(ruleId) {
  try {
    const res = await fetch(`./api/rules/${ruleId}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchState();
      return;
    }
  } catch {}

  localRules = localRules.filter((r, idx) => r.id !== ruleId && idx !== ruleId);
  saveLocalState();
  await fetchState();
}

function openSimulateModal() {
  document.getElementById('sim-instrument').value =
    activeTab === 'CREDITO' ? 'CREDITO' : 'DEBITO_CUENTA';
  document.getElementById('modal-simulate').classList.add('open');
}

function closeSimulateModal() {
  document.getElementById('modal-simulate').classList.remove('open');
}

async function submitCustomSimulation() {
  const instrument = document.getElementById('sim-instrument').value;
  const flow_type = document.getElementById('sim-flow-type').value;
  const merchant = document.getElementById('sim-merchant').value || 'SERVICIOS Y COMER';
  const amount = Number(document.getElementById('sim-amount').value) || 3490;

  try {
    const res = await fetch('./api/simulate-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instrument, flow_type, merchant, amount })
    });
    if (res.ok) {
      closeSimulateModal();
      await fetchState();
      return;
    }
  } catch {}

  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const isIng = flow_type === 'INGRESO';
  const nec = isIng ? 'Ingreso' : amount <= 8000 ? 'Gasto Hormiga' : 'Opcional / Prescindible';
  const cat = isIng ? 'Ingresos / Abonos' : 'Alimentación / Cafetería';

  localTransactions.unshift({
    id: Date.now(),
    gmail_message_id: 'sim-' + Date.now().toString(36),
    display_date: `${dd}/${mm}/2026 ${hh}:${min}`,
    amount,
    flow_type,
    instrument,
    card_last4: instrument === 'CREDITO' ? 'Tarjeta Crédito ****4114' : 'Cuenta ****0401',
    merchant,
    category: cat,
    necessity_level: nec,
    ai_justification: getDefaultJustification(merchant, cat, nec),
    source: 'GMAIL_REAL'
  });
  saveLocalState();
  closeSimulateModal();
  showToast('⚡ Transacción Procesada', `${merchant} · ${formatCLP(amount)} CLP`);
  await fetchState();
}

function openFintualPosModal() {
  document.getElementById('modal-fintual-pos').classList.add('open');
}

function closeFintualPosModal() {
  document.getElementById('modal-fintual-pos').classList.remove('open');
}

async function submitFintualPosition() {
  const ticker = (document.getElementById('fp-ticker').value || 'AAPL').toUpperCase().trim();
  const name = document.getElementById('fp-name').value || ticker;
  const shares = Number(document.getElementById('fp-shares').value) || 0.5;
  const avg_buy_price_usd = Number(document.getElementById('fp-avg').value) || 200;
  const current_price_usd = Number(document.getElementById('fp-cur').value) || 215;
  const notes = document.getElementById('fp-notes').value;

  try {
    const res = await fetch('./api/fintual/positions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker, name, asset_type: 'STOCK', shares, avg_buy_price_usd, current_price_usd, notes })
    });
    if (res.ok) {
      closeFintualPosModal();
      showToast('Portafolio Fintual Actualizado', `Posición en ${ticker} guardada.`);
      await fetchState();
      return;
    }
  } catch {}

  const idx = localFintualPositions.findIndex((p) => p.ticker === ticker);
  const obj = { ticker, name, asset_type: 'STOCK', shares, avg_buy_price_usd, current_price_usd, target_weight_pct: 15, notes };
  if (idx >= 0) localFintualPositions[idx] = obj;
  else localFintualPositions.push(obj);
  saveLocalState();
  closeFintualPosModal();
  showToast('Portafolio Fintual Actualizado', `Posición en ${ticker} guardada en tu dispositivo.`);
  await fetchState();
}

async function simulateInvestmentAgentSignal() {
  const sampleSignals = [
    {
      agent_id: 'fintual-invest-agent-v1',
      action_type: 'BUY',
      ticker: 'NVDA',
      suggested_amount_clp: 85000,
      suggested_amount_usd: 87.63,
      confidence_pct: 91,
      reasoning: 'Oportunidad táctica en infraestructura IA utilizando parte del excedente libre de Cuenta Corriente ****0401 post-reserva de Tarjeta de Crédito.',
      source_liquidity_note: 'Excedente libre tras reservar $201.353 CLP para pagar TC ****4114.'
    },
    {
      agent_id: 'fintual-invest-agent-v1',
      action_type: 'DCA',
      ticker: 'VOO',
      suggested_amount_clp: 100000,
      suggested_amount_usd: 103.09,
      confidence_pct: 95,
      reasoning: 'Inversión indexada mensual S&P 500 financiada con liquidez disponible tras apartar los $201.353 CLP del pago de Tarjeta de Crédito Noviembre.',
      source_liquidity_note: 'Puente automático Mi Cuenta → Fintual Acciones.'
    }
  ];
  const pick = sampleSignals[Math.floor(Math.random() * sampleSignals.length)];

  try {
    const res = await fetch('./api/fintual/agent-signal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pick)
    });
    if (res.ok) return;
  } catch {}

  localFintualSignals.unshift(pick);
  saveLocalState();
  showToast(`📈 Señal Fintual: ${pick.action_type} ${pick.ticker}`, `${formatCLP(pick.suggested_amount_clp)} (${formatUSD(pick.suggested_amount_usd)})`);
  await fetchState();
}

/* ================= MODALES DE ANDROID INSTALL & NUBE 24/7 ================= */
async function triggerAndroidInstall() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('📲 Instalación Iniciada', 'Mis Gastos IA IA se está agregando a la pantalla de tu Android.');
    }
    deferredInstallPrompt = null;
    return;
  }
  document.getElementById('modal-android-install').classList.add('open');
}

function closeAndroidInstallModal() {
  document.getElementById('modal-android-install').classList.remove('open');
}

function openCloudConfigModal() {
  document.getElementById('cloud-worker-url').value = localStorage.getItem('bch_cloud_worker_url') || '';
  document.getElementById('cloud-worker-token').value = localStorage.getItem('bch_cloud_worker_token') || '';
  document.getElementById('app-lock-pin').value = localStorage.getItem('bch_app_lock_pin') || '';
  document.getElementById('modal-cloud-config').classList.add('open');
}

function closeCloudConfigModal() {
  document.getElementById('modal-cloud-config').classList.remove('open');
}

async function saveCloudWorkerUrl() {
  const url = (document.getElementById('cloud-worker-url').value || '').trim();
  const token = (document.getElementById('cloud-worker-token').value || '').trim();
  const pin = (document.getElementById('app-lock-pin').value || '').trim();

  if (url) localStorage.setItem('bch_cloud_worker_url', url);
  else localStorage.removeItem('bch_cloud_worker_url');

  if (token) localStorage.setItem('bch_cloud_worker_token', token);
  else localStorage.removeItem('bch_cloud_worker_token');

  if (pin) localStorage.setItem('bch_app_lock_pin', pin);
  else localStorage.removeItem('bch_app_lock_pin');

  showToast('🔒 Seguridad Actualizada', 'Configuración de Token 24/7 y PIN guardada en tu Android.');
  closeCloudConfigModal();
  await fetchState();
}

function verifyAppPin() {
  const savedPin = localStorage.getItem('bch_app_lock_pin');
  const entered = (document.getElementById('unlock-pin-input').value || '').trim();
  if (!savedPin || entered === savedPin) {
    document.getElementById('modal-pin-lock').classList.remove('open');
    document.getElementById('unlock-pin-error').style.display = 'none';
  } else {
    document.getElementById('unlock-pin-error').style.display = 'block';
  }
}

(function init() {
  const savedTheme = localStorage.getItem('bch_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  const savedPin = localStorage.getItem('bch_app_lock_pin');
  if (savedPin) {
    const lockModal = document.getElementById('modal-pin-lock');
    if (lockModal) lockModal.classList.add('open');
  }
  if (window.location.protocol === 'file:') {
    const installBtn = document.getElementById('btn-install-pwa');
    if (installBtn) installBtn.style.display = 'none';
  } else if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  fetchState();
  initSSE();
})();
