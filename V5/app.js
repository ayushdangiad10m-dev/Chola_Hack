const initialWorkers = [
  {id:'arjun',name:'Arjun Kumar',phone:'9876543210',role:'Master Carpenter',rank:'DIAMOND',cls:'diamond',rating:'4.9',jobs:'186 jobs',rate:'₹1,250/day',image:'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=180&q=80',distance:'1.2 km away',skills:'Custom furniture · Wardrobes',travel:'₹0 — nearby zone',category:'Carpenter',lat:12.9784,lng:77.6408,experience:'6-8 years',available:true,reviews:[{author:'Rahul V.',rating:5,text:'Superb wardrobe finish, precise alignment and very punctual.'},{author:'Priya M.',rating:5,text:'Expert woodwork, cleaned up the site nicely.'}]},
  {id:'meera',name:'Meera S.',phone:'9845123456',role:'Finish Painter',rank:'GOLD',cls:'gold',rating:'4.8',jobs:'94 jobs',rate:'₹1,050/day',image:'https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=180&q=80',distance:'2.1 km away',skills:'Textures · Color consultation',travel:'₹60 travel support',category:'Painter',lat:12.9612,lng:77.6387,experience:'4-5 years',available:true,reviews:[{author:'Sandeep K.',rating:5,text:'Great color advice and smooth texture coat.'}]},
  {id:'sameer',name:'Sameer Khan',phone:'9811223344',role:'Masonry Pro',rank:'VIP',cls:'pro',rating:'4.9',jobs:'241 jobs',rate:'₹1,500/day',image:'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=180&q=80',distance:'0.8 km away',skills:'Brickwork · Plastering',travel:'₹0 — nearby zone',category:'Mason',lat:12.9716,lng:77.6522,experience:'10+ years',available:true,reviews:[{author:'Anil D.',rating:5,text:'Master mason, built the compound wall straight as an arrow.'}]},
  {id:'dev',name:'Dev Raj',phone:'9740112233',role:'Electrician',rank:'SILVER',cls:'silver',rating:'4.7',jobs:'58 jobs',rate:'₹900/day',image:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=180&q=80',distance:'3.0 km away',skills:'Wiring · Smart homes',travel:'₹90 travel support',category:'Electrician',lat:12.9856,lng:77.6191,experience:'2-3 years',available:true,reviews:[{author:'Kavita R.',rating:4.8,text:'Fixed all heavy circuit wiring safely.'}]},
  {id:'anita',name:'Anita Devi',phone:'9900112244',role:'Tile Specialist',rank:'GOLD',cls:'gold',rating:'4.8',jobs:'112 jobs',rate:'₹1,100/day',image:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80',distance:'1.7 km away',skills:'Bathroom · Floor tiling',travel:'₹40 travel support',category:'Mason',lat:12.9653,lng:77.6289,experience:'5 years',available:true,reviews:[{author:'Deepak S.',rating:5,text:'Flawless joint finish on Italian tiles.'}]},
  {id:'ravi',name:'Ravi Teja',phone:'9886778899',role:'Plumbing Expert',rank:'DIAMOND',cls:'diamond',rating:'4.9',jobs:'168 jobs',rate:'₹1,220/day',image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=180&q=80',distance:'2.4 km away',skills:'Piping · Fixtures',travel:'₹75 travel support',category:'Plumber',lat:12.9745,lng:77.6501,experience:'8 years',available:true,reviews:[{author:'Vikram G.',rating:5,text:'Fast leakage resolution and quality CPVC lines.'}]}
];

function getCustomWorkers(){try{return JSON.parse(localStorage.getItem('nirmaan_custom_workers')||'[]');}catch(e){return[];}}
function saveCustomWorkers(list){
  try {
    localStorage.setItem('nirmaan_custom_workers', JSON.stringify(list));
  } catch(e) {
    try {
      const stripped = list.map(item => ({
        ...item,
        image: (item.image && item.image.length > 5000) ? '' : item.image
      }));
      localStorage.setItem('nirmaan_custom_workers', JSON.stringify(stripped));
    } catch(err){}
  }
}
function getLoggedWorker(){try{return JSON.parse(localStorage.getItem('nirmaan_logged_worker')||'null');}catch(e){return null;}}
function setLoggedWorker(worker){
  currentLoggedWorker = worker;
  if(worker){
    try {
      localStorage.setItem('nirmaan_logged_worker', JSON.stringify(worker));
    } catch(e) {
      try {
        const lightweight = { ...worker, image: '' };
        localStorage.setItem('nirmaan_logged_worker', JSON.stringify(lightweight));
      } catch(err){}
    }
  } else {
    try {
      localStorage.removeItem('nirmaan_logged_worker');
    } catch(e){}
  }
  updateHeaderProfile();
}

let workers = [...initialWorkers, ...getCustomWorkers()];
let currentLoggedWorker = getLoggedWorker();
let currentLoggedCustomer = null;
try { currentLoggedCustomer = JSON.parse(localStorage.getItem('nirmaan_logged_customer')||'null'); } catch(e){}
let cameraStream = null;

function stopCameraStream(){
  if(cameraStream){
    cameraStream.getTracks().forEach(track=>track.stop());
    cameraStream=null;
  }
}

const nearbyJobsFeed = [
  {id:'j1',trade:'Carpenter',title:'Wardrobe & Modular Kitchen Shuttering',loc:'Indiranagar, Bengaluru',rate:'₹1,350/day',days:'4 days work',dist:'1.2 km away',status:'open'},
  {id:'j2',trade:'Painter',title:'Full 3BHK Texture Wall Finish & Polish',loc:'Domlur, Bengaluru',rate:'₹1,150/day',days:'6 days work',dist:'1.8 km away',status:'open'},
  {id:'j3',trade:'Mason',title:'Terrace Waterproofing & Brick Masonry',loc:'Koramangala, Bengaluru',rate:'₹1,400/day',days:'3 days work',dist:'2.1 km away',status:'open'},
  {id:'j4',trade:'Electrician',title:'Concealed Conduit & Inverter Installation',loc:'HSR Layout, Bengaluru',rate:'₹1,100/day',days:'2 days work',dist:'2.8 km away',status:'open'},
  {id:'j5',trade:'Plumber',title:'CPVC Overhead Tank Line & Bathroom Fixtures',loc:'Old Airport Rd, Bengaluru',rate:'₹1,250/day',days:'2 days work',dist:'1.5 km away',status:'open'}
];

const DEFAULT_LAT=12.9716,DEFAULT_LNG=77.6412;
let currentMap=null;
let regPhotoData='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=180&q=80';
let regCoords={lat:DEFAULT_LAT,lng:DEFAULT_LNG};

function getUserLocation(){return new Promise((resolve)=>{if(!navigator.geolocation){resolve({lat:DEFAULT_LAT,lng:DEFAULT_LNG});return;}navigator.geolocation.getCurrentPosition(pos=>resolve({lat:pos.coords.latitude,lng:pos.coords.longitude}),()=>resolve({lat:DEFAULT_LAT,lng:DEFAULT_LNG}),{enableHighAccuracy:true,timeout:8000});});}
function createMapIcon(color,label){return L.divIcon({className:'',html:`<div style="width:36px;height:36px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 3px 10px #0004;display:grid;place-items:center;color:white;font:bold 11px var(--mono)">${label}</div>`,iconSize:[36,36],iconAnchor:[18,18],popupAnchor:[0,-20]});}
function createWorkerMapIcon(w){return L.divIcon({className:'',html:`<div style="width:44px;height:44px;border-radius:50%;overflow:hidden;border:3px solid white;box-shadow:0 3px 12px #0004"><img src="${w.image}" style="width:100%;height:100%;object-fit:cover" alt="${w.name}"/></div>`,iconSize:[44,44],iconAnchor:[22,22],popupAnchor:[0,-24]});}
function initMap(containerId,centerLat,centerLng,zoom){if(currentMap){currentMap.remove();currentMap=null;}const el=document.getElementById(containerId);if(!el)return null;const map=L.map(containerId,{scrollWheelZoom:false}).setView([centerLat,centerLng],zoom||14);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);currentMap=map;setTimeout(()=>map.invalidateSize(),200);return map;}
function calcDistance(lat1,lng1,lat2,lng2){const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLng=(lng2-lng1)*Math.PI/180,a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}

let currentLanguage='en';

const INDIAN_CITIES_DB = [
  // Uttar Pradesh (Districts & Major Tehsils)
  {name:'Lucknow', type:'District', district:'Lucknow', state:'Uttar Pradesh', pin:'226001', lat:26.8467, lng:80.9462},
  {name:'Gomti Nagar / Indira Nagar', type:'Tehsil/Area', district:'Lucknow', state:'Uttar Pradesh', pin:'226010', lat:26.8489, lng:81.0028},
  {name:'Mohanlalganj', type:'Tehsil', district:'Lucknow', state:'Uttar Pradesh', pin:'226301', lat:26.6782, lng:80.9856},
  {name:'Bakshi Ka Talab (BKT)', type:'Tehsil', district:'Lucknow', state:'Uttar Pradesh', pin:'226201', lat:27.0058, lng:80.8924},
  {name:'Kanpur Nagar', type:'District', district:'Kanpur Nagar', state:'Uttar Pradesh', pin:'208001', lat:26.4499, lng:80.3319},
  {name:'Ghatampur', type:'Tehsil', district:'Kanpur Nagar', state:'Uttar Pradesh', pin:'209206', lat:26.1583, lng:80.1653},
  {name:'Bilhaur', type:'Tehsil', district:'Kanpur Nagar', state:'Uttar Pradesh', pin:'209202', lat:26.8528, lng:80.0528},
  {name:'Varanasi', type:'District', district:'Varanasi', state:'Uttar Pradesh', pin:'221001', lat:25.3176, lng:82.9739},
  {name:'Pindra', type:'Tehsil', district:'Varanasi', state:'Uttar Pradesh', pin:'221206', lat:25.4859, lng:82.8086},
  {name:'Prayagraj (Allahabad)', type:'District', district:'Prayagraj', state:'Uttar Pradesh', pin:'211001', lat:25.4358, lng:81.8463},
  {name:'Phulpur', type:'Tehsil', district:'Prayagraj', state:'Uttar Pradesh', pin:'212402', lat:25.5562, lng:82.0838},
  {name:'Soraon', type:'Tehsil', district:'Prayagraj', state:'Uttar Pradesh', pin:'212502', lat:25.5833, lng:81.8500},
  {name:'Handia', type:'Tehsil', district:'Prayagraj', state:'Uttar Pradesh', pin:'221503', lat:25.3621, lng:82.1798},
  {name:'Noida', type:'Tehsil/City', district:'Gautam Buddha Nagar', state:'Uttar Pradesh', pin:'201301', lat:28.5708, lng:77.3260},
  {name:'Dadri', type:'Tehsil', district:'Gautam Buddha Nagar', state:'Uttar Pradesh', pin:'203207', lat:28.5528, lng:77.5539},
  {name:'Jewar', type:'Tehsil', district:'Gautam Buddha Nagar', state:'Uttar Pradesh', pin:'203135', lat:28.1286, lng:77.5567},
  {name:'Ghaziabad', type:'District', district:'Ghaziabad', state:'Uttar Pradesh', pin:'201001', lat:28.6692, lng:77.4538},
  {name:'Modinagar', type:'Tehsil', district:'Ghaziabad', state:'Uttar Pradesh', pin:'201204', lat:28.8354, lng:77.5750},
  {name:'Agra', type:'District', district:'Agra', state:'Uttar Pradesh', pin:'282001', lat:27.1767, lng:78.0081},
  {name:'Fatehabad', type:'Tehsil', district:'Agra', state:'Uttar Pradesh', pin:'283111', lat:27.0219, lng:78.3072},
  {name:'Gorakhpur', type:'District', district:'Gorakhpur', state:'Uttar Pradesh', pin:'273001', lat:26.7606, lng:83.3732},
  {name:'Sahjanwa', type:'Tehsil', district:'Gorakhpur', state:'Uttar Pradesh', pin:'273209', lat:26.7634, lng:83.1895},
  {name:'Chandausi', type:'Tehsil', district:'Sambhal', state:'Uttar Pradesh', pin:'244412', lat:28.4556, lng:78.7758},
  {name:'Sambhal', type:'District', district:'Sambhal', state:'Uttar Pradesh', pin:'244302', lat:28.5833, lng:78.5500},
  {name:'Bareilly', type:'District', district:'Bareilly', state:'Uttar Pradesh', pin:'243001', lat:28.3670, lng:79.4304},
  {name:'Meerut', type:'District', district:'Meerut', state:'Uttar Pradesh', pin:'250001', lat:28.9845, lng:77.7064},
  {name:'Aligarh', type:'District', district:'Aligarh', state:'Uttar Pradesh', pin:'202001', lat:27.8974, lng:78.0880},
  {name:'Mathura', type:'District', district:'Mathura', state:'Uttar Pradesh', pin:'281001', lat:27.4924, lng:77.6737},
  {name:'Jhansi', type:'District', district:'Jhansi', state:'Uttar Pradesh', pin:'284001', lat:25.4484, lng:78.5685},
  {name:'Ayodhya (Faizabad)', type:'District', district:'Ayodhya', state:'Uttar Pradesh', pin:'224001', lat:26.7730, lng:82.1460},
  {name:'Muzaffarnagar', type:'District', district:'Muzaffarnagar', state:'Uttar Pradesh', pin:'251001', lat:29.4727, lng:77.7085},
  {name:'Moradabad', type:'District', district:'Moradabad', state:'Uttar Pradesh', pin:'244001', lat:28.8386, lng:78.7733},
  {name:'Azamgarh', type:'District', district:'Azamgarh', state:'Uttar Pradesh', pin:'276001', lat:26.0683, lng:83.1840},
  {name:'Jaunpur', type:'District', district:'Jaunpur', state:'Uttar Pradesh', pin:'222001', lat:25.7464, lng:82.6837},
  {name:'Mirzapur', type:'District', district:'Mirzapur', state:'Uttar Pradesh', pin:'231001', lat:25.1337, lng:82.5644},

  // Bihar (Districts & Major Tehsils / Sub-Divisions)
  {name:'Patna', type:'District', district:'Patna', state:'Bihar', pin:'800001', lat:25.5941, lng:85.1376},
  {name:'Danapur', type:'Tehsil/Sub-Division', district:'Patna', state:'Bihar', pin:'801503', lat:25.6333, lng:85.0500},
  {name:'Barh', type:'Tehsil/Sub-Division', district:'Patna', state:'Bihar', pin:'803213', lat:25.4833, lng:85.7167},
  {name:'Masaurhi', type:'Tehsil', district:'Patna', state:'Bihar', pin:'804452', lat:25.3500, lng:85.0333},
  {name:'Muzaffarpur', type:'District', district:'Muzaffarpur', state:'Bihar', pin:'842001', lat:26.1209, lng:85.3647},
  {name:'Gaya', type:'District', district:'Gaya', state:'Bihar', pin:'823001', lat:24.7914, lng:85.0002},
  {name:'Bhagalpur', type:'District', district:'Bhagalpur', state:'Bihar', pin:'812001', lat:25.2425, lng:86.9842},
  {name:'Darbhanga', type:'District', district:'Darbhanga', state:'Bihar', pin:'846001', lat:26.1542, lng:85.8918},
  {name:'Purnia', type:'District', district:'Purnia', state:'Bihar', pin:'854301', lat:25.7771, lng:87.4753},
  {name:'Begusarai', type:'District', district:'Begusarai', state:'Bihar', pin:'851101', lat:25.4182, lng:86.1272},
  {name:'Ara (Bhojpur)', type:'District', district:'Bhojpur', state:'Bihar', pin:'802301', lat:25.5541, lng:84.6644},
  {name:'Chhapra (Saran)', type:'District', district:'Saran', state:'Bihar', pin:'841301', lat:25.7848, lng:84.7274},
  {name:'Marhowrah', type:'Tehsil', district:'Saran', state:'Bihar', pin:'841418', lat:25.9667, lng:84.8667},
  {name:'Samastipur', type:'District', district:'Samastipur', state:'Bihar', pin:'848101', lat:25.8628, lng:85.7811},
  {name:'Katihar', type:'District', district:'Katihar', state:'Bihar', pin:'854105', lat:25.5541, lng:87.5714},
  {name:'Lakhisarai', type:'District', district:'Lakhisarai', state:'Bihar', pin:'811311', lat:25.1764, lng:85.9989},
  {name:'Halsi', type:'Tehsil/Block', district:'Lakhisarai', state:'Bihar', pin:'811317', lat:25.0745, lng:85.9721},
  {name:'Nalanda (Bihar Sharif)', type:'District', district:'Nalanda', state:'Bihar', pin:'803101', lat:25.1982, lng:85.5149},
  {name:'Rohtas (Sasaram)', type:'District', district:'Rohtas', state:'Bihar', pin:'821115', lat:24.9500, lng:84.0167},
  {name:'Madhubani', type:'District', district:'Madhubani', state:'Bihar', pin:'847211', lat:26.3537, lng:86.0716},

  // Rajasthan (Districts & Tehsils)
  {name:'Jaipur', type:'District', district:'Jaipur', state:'Rajasthan', pin:'302001', lat:26.9124, lng:75.7873},
  {name:'Sanganer', type:'Tehsil', district:'Jaipur', state:'Rajasthan', pin:'302029', lat:26.8183, lng:75.7761},
  {name:'Amer', type:'Tehsil', district:'Jaipur', state:'Rajasthan', pin:'302028', lat:26.9855, lng:75.8507},
  {name:'Chaksu', type:'Tehsil', district:'Jaipur', state:'Rajasthan', pin:'303901', lat:26.6028, lng:75.9528},
  {name:'Jodhpur', type:'District', district:'Jodhpur', state:'Rajasthan', pin:'342001', lat:26.2389, lng:73.0243},
  {name:'Bilara', type:'Tehsil', district:'Jodhpur', state:'Rajasthan', pin:'342602', lat:26.1833, lng:73.7000},
  {name:'Osian', type:'Tehsil', district:'Jodhpur', state:'Rajasthan', pin:'342303', lat:26.7264, lng:72.9056},
  {name:'Udaipur', type:'District', district:'Udaipur', state:'Rajasthan', pin:'313001', lat:24.5854, lng:73.7125},
  {name:'Gogunda', type:'Tehsil', district:'Udaipur', state:'Rajasthan', pin:'313705', lat:24.7667, lng:73.5333},
  {name:'Mavli', type:'Tehsil', district:'Udaipur', state:'Rajasthan', pin:'313203', lat:24.7833, lng:73.9833},
  {name:'Kota', type:'District', district:'Kota', state:'Rajasthan', pin:'324001', lat:25.2138, lng:75.8648},
  {name:'Bikaner', type:'District', district:'Bikaner', state:'Rajasthan', pin:'334001', lat:28.0229, lng:73.3119},
  {name:'Ajmer', type:'District', district:'Ajmer', state:'Rajasthan', pin:'305001', lat:26.4499, lng:74.6399},
  {name:'Kishangarh', type:'Tehsil', district:'Ajmer', state:'Rajasthan', pin:'305801', lat:26.5700, lng:74.8600},
  {name:'Pali', type:'District', district:'Pali', state:'Rajasthan', pin:'306401', lat:25.7711, lng:73.3234},
  {name:'Sojat', type:'Tehsil', district:'Pali', state:'Rajasthan', pin:'306104', lat:25.9250, lng:73.6667},
  {name:'Alwar', type:'District', district:'Alwar', state:'Rajasthan', pin:'301001', lat:27.5530, lng:76.6346},
  {name:'Bhilwara', type:'District', district:'Bhilwara', state:'Rajasthan', pin:'311001', lat:25.3407, lng:74.6313},
  {name:'Sikar', type:'District', district:'Sikar', state:'Rajasthan', pin:'332001', lat:27.6094, lng:75.1399},
  {name:'Bharatpur', type:'District', district:'Bharatpur', state:'Rajasthan', pin:'321001', lat:27.2152, lng:77.5030},

  // Maharashtra (Districts & Tehsils/Talukas)
  {name:'Mumbai City', type:'District', district:'Mumbai City', state:'Maharashtra', pin:'400001', lat:18.9322, lng:72.8350},
  {name:'Andheri / Bandra', type:'Taluka', district:'Mumbai Suburban', state:'Maharashtra', pin:'400053', lat:19.1363, lng:72.8277},
  {name:'Borivali / Kurla', type:'Taluka', district:'Mumbai Suburban', state:'Maharashtra', pin:'400092', lat:19.2288, lng:72.8541},
  {name:'Pune', type:'District', district:'Pune', state:'Maharashtra', pin:'411001', lat:18.5204, lng:73.8567},
  {name:'Haveli', type:'Taluka', district:'Pune', state:'Maharashtra', pin:'411028', lat:18.4988, lng:73.9312},
  {name:'Mulshi (Hinjewadi)', type:'Taluka', district:'Pune', state:'Maharashtra', pin:'412108', lat:18.5447, lng:73.5133},
  {name:'Baramati', type:'Taluka', district:'Pune', state:'Maharashtra', pin:'413102', lat:18.1517, lng:74.5772},
  {name:'Khed / Shirur', type:'Taluka', district:'Pune', state:'Maharashtra', pin:'410501', lat:18.8500, lng:73.9000},
  {name:'Thane', type:'District', district:'Thane', state:'Maharashtra', pin:'400601', lat:19.1982, lng:72.9781},
  {name:'Kalyan / Dombivli', type:'Taluka', district:'Thane', state:'Maharashtra', pin:'421301', lat:19.2437, lng:73.1355},
  {name:'Nagpur', type:'District', district:'Nagpur', state:'Maharashtra', pin:'440001', lat:21.1458, lng:79.0882},
  {name:'Nashik', type:'District', district:'Nashik', state:'Maharashtra', pin:'422001', lat:19.9975, lng:73.7898},
  {name:'Malegaon', type:'Taluka', district:'Nashik', state:'Maharashtra', pin:'423203', lat:20.5539, lng:74.5283},
  {name:'Chhatrapati Sambhajinagar (Aurangabad)', type:'District', district:'Aurangabad', state:'Maharashtra', pin:'431001', lat:19.8762, lng:75.3433},
  {name:'Solapur', type:'District', district:'Solapur', state:'Maharashtra', pin:'413001', lat:17.6599, lng:75.9064},
  {name:'Kolhapur', type:'District', district:'Kolhapur', state:'Maharashtra', pin:'416001', lat:16.7050, lng:74.2433},
  {name:'Amravati', type:'District', district:'Amravati', state:'Maharashtra', pin:'444601', lat:20.9320, lng:77.7523},
  {name:'Navi Mumbai', type:'City/Area', district:'Thane', state:'Maharashtra', pin:'400703', lat:19.0771, lng:72.9986},

  // Karnataka (Districts & Taluks)
  {name:'Bengaluru Urban', type:'District', district:'Bengaluru Urban', state:'Karnataka', pin:'560001', lat:12.9716, lng:77.5946},
  {name:'Indiranagar / East', type:'Taluk/Area', district:'Bengaluru Urban', state:'Karnataka', pin:'560038', lat:12.9784, lng:77.6408},
  {name:'Anekal', type:'Taluk', district:'Bengaluru Urban', state:'Karnataka', pin:'562106', lat:12.7107, lng:77.6974},
  {name:'Devanahalli', type:'Taluk', district:'Bengaluru Rural', state:'Karnataka', pin:'562110', lat:13.2483, lng:77.7126},
  {name:'Mysuru (Mysore)', type:'District', district:'Mysuru', state:'Karnataka', pin:'570001', lat:12.2958, lng:76.6394},
  {name:'Nanjangud', type:'Taluk', district:'Mysuru', state:'Karnataka', pin:'571301', lat:12.1200, lng:76.6800},
  {name:'Dharwad / Hubballi', type:'District', district:'Dharwad', state:'Karnataka', pin:'580001', lat:15.4589, lng:75.0078},
  {name:'Mangaluru (Dakshina Kannada)', type:'District', district:'Dakshina Kannada', state:'Karnataka', pin:'575001', lat:12.9141, lng:74.8560},
  {name:'Belagavi (Belgaum)', type:'District', district:'Belagavi', state:'Karnataka', pin:'590001', lat:15.8497, lng:74.4977},
  {name:'Ballari (Bellary)', type:'District', district:'Ballari', state:'Karnataka', pin:'583101', lat:15.1394, lng:76.9214},
  {name:'Hosapete (Hampi)', type:'Taluk/District', district:'Vijayanagara', state:'Karnataka', pin:'583201', lat:15.2689, lng:76.3909},
  {name:'Kalaburagi (Gulbarga)', type:'District', district:'Kalaburagi', state:'Karnataka', pin:'585101', lat:17.3297, lng:76.8343},
  {name:'Shivamogga (Shimoga)', type:'District', district:'Shivamogga', state:'Karnataka', pin:'577201', lat:13.9299, lng:75.5681},
  {name:'Tumakuru (Tumkur)', type:'District', district:'Tumakuru', state:'Karnataka', pin:'572101', lat:13.3379, lng:77.1173},
  {name:'Udupi', type:'District', district:'Udupi', state:'Karnataka', pin:'576101', lat:13.3409, lng:74.7421},

  // Madhya Pradesh (Districts & Tehsils)
  {name:'Bhopal', type:'District', district:'Bhopal', state:'Madhya Pradesh', pin:'462001', lat:23.2599, lng:77.4126},
  {name:'Huzur / Kolar', type:'Tehsil', district:'Bhopal', state:'Madhya Pradesh', pin:'462042', lat:23.1800, lng:77.4200},
  {name:'Indore', type:'District', district:'Indore', state:'Madhya Pradesh', pin:'452001', lat:22.7196, lng:75.8577},
  {name:'Mhow (Dr. Ambedkar Nagar)', type:'Tehsil', district:'Indore', state:'Madhya Pradesh', pin:'453441', lat:22.5539, lng:75.7634},
  {name:'Sanwer', type:'Tehsil', district:'Indore', state:'Madhya Pradesh', pin:'453551', lat:22.9772, lng:75.8308},
  {name:'Jabalpur', type:'District', district:'Jabalpur', state:'Madhya Pradesh', pin:'482001', lat:23.1815, lng:79.9864},
  {name:'Gwalior', type:'District', district:'Gwalior', state:'Madhya Pradesh', pin:'474001', lat:26.2183, lng:78.1828},
  {name:'Ujjain', type:'District', district:'Ujjain', state:'Madhya Pradesh', pin:'456001', lat:23.1765, lng:75.7885},
  {name:'Sagar', type:'District', district:'Sagar', state:'Madhya Pradesh', pin:'470001', lat:23.8388, lng:78.7378},
  {name:'Rewa', type:'District', district:'Rewa', state:'Madhya Pradesh', pin:'486001', lat:24.5362, lng:81.3037},
  {name:'Satna', type:'District', district:'Satna', state:'Madhya Pradesh', pin:'485001', lat:24.5800, lng:80.8300},

  // Delhi NCR
  {name:'New Delhi', type:'District', district:'New Delhi', state:'Delhi', pin:'110001', lat:28.6139, lng:77.2090},
  {name:'Central Delhi (Connaught Place)', type:'Tehsil/Sub-Division', district:'Central Delhi', state:'Delhi', pin:'110001', lat:28.6315, lng:77.2167},
  {name:'South Delhi (Saket / Hauz Khas)', type:'Tehsil/Sub-Division', district:'South Delhi', state:'Delhi', pin:'110017', lat:28.5244, lng:77.2181},
  {name:'North West Delhi (Rohini)', type:'Tehsil/Sub-Division', district:'North West Delhi', state:'Delhi', pin:'110085', lat:28.7159, lng:77.1031},
  {name:'South West Delhi (Dwarka)', type:'Tehsil/Sub-Division', district:'South West Delhi', state:'Delhi', pin:'110075', lat:28.5921, lng:77.0460},
  {name:'East Delhi (Preet Vihar / Mayur Vihar)', type:'Tehsil/Sub-Division', district:'East Delhi', state:'Delhi', pin:'110092', lat:28.6358, lng:77.2942},
  {name:'West Delhi (Rajouri Garden / Patel Nagar)', type:'Tehsil/Sub-Division', district:'West Delhi', state:'Delhi', pin:'110027', lat:28.6472, lng:77.1219},
  {name:'North Delhi (Civil Lines)', type:'Tehsil/Sub-Division', district:'North Delhi', state:'Delhi', pin:'110054', lat:28.6750, lng:77.2250},
  {name:'Shahdara', type:'District', district:'Shahdara', state:'Delhi', pin:'110032', lat:28.6738, lng:77.2934},
  {name:'Gurugram (Gurgaon)', type:'District', district:'Gurugram', state:'Haryana', pin:'122001', lat:28.4595, lng:77.0266},
  {name:'Faridabad', type:'District', district:'Faridabad', state:'Haryana', pin:'121001', lat:28.4089, lng:77.3178},

  // Gujarat
  {name:'Ahmedabad', type:'District', district:'Ahmedabad', state:'Gujarat', pin:'380001', lat:23.0225, lng:72.5714},
  {name:'Daskroi', type:'Taluka', district:'Ahmedabad', state:'Gujarat', pin:'382445', lat:22.9500, lng:72.6333},
  {name:'Sanand', type:'Taluka', district:'Ahmedabad', state:'Gujarat', pin:'382110', lat:22.9833, lng:72.3833},
  {name:'Surat', type:'District', district:'Surat', state:'Gujarat', pin:'395001', lat:21.1702, lng:72.8311},
  {name:'Choryasi / Adajan', type:'Taluka', district:'Surat', state:'Gujarat', pin:'395009', lat:21.1959, lng:72.7933},
  {name:'Vadodara (Baroda)', type:'District', district:'Vadodara', state:'Gujarat', pin:'390001', lat:22.3072, lng:73.1812},
  {name:'Rajkot', type:'District', district:'Rajkot', state:'Gujarat', pin:'360001', lat:22.3039, lng:70.8022},
  {name:'Bhavnagar', type:'District', district:'Bhavnagar', state:'Gujarat', pin:'364001', lat:21.7645, lng:72.1519},

  // Telangana & Andhra Pradesh
  {name:'Hyderabad', type:'District', district:'Hyderabad', state:'Telangana', pin:'500001', lat:17.3850, lng:78.4867},
  {name:'Serilingampally / Hitec City', type:'Mandal', district:'Ranga Reddy', state:'Telangana', pin:'500081', lat:17.4435, lng:78.3772},
  {name:'Secunderabad', type:'Mandal', district:'Hyderabad', state:'Telangana', pin:'500003', lat:17.4399, lng:78.4983},
  {name:'Warangal', type:'District', district:'Hanamkonda', state:'Telangana', pin:'506001', lat:17.9689, lng:79.5941},
  {name:'Visakhapatnam', type:'District', district:'Visakhapatnam', state:'Andhra Pradesh', pin:'530001', lat:17.6868, lng:83.2185},
  {name:'Vijayawada', type:'District/City', district:'NTR', state:'Andhra Pradesh', pin:'520001', lat:16.5062, lng:80.6480},
  {name:'Guntur', type:'District', district:'Guntur', state:'Andhra Pradesh', pin:'522002', lat:16.3067, lng:80.4365},
  {name:'Tirupati', type:'District', district:'Tirupati', state:'Andhra Pradesh', pin:'517501', lat:13.6288, lng:79.4192},

  // Tamil Nadu
  {name:'Chennai', type:'District', district:'Chennai', state:'Tamil Nadu', pin:'600001', lat:13.0827, lng:80.2707},
  {name:'Guindy / Mylapore', type:'Taluk', district:'Chennai', state:'Tamil Nadu', pin:'600032', lat:13.0067, lng:80.2088},
  {name:'Coimbatore', type:'District', district:'Coimbatore', state:'Tamil Nadu', pin:'641001', lat:11.0168, lng:76.9558},
  {name:'Madurai', type:'District', district:'Madurai', state:'Tamil Nadu', pin:'625001', lat:9.9252, lng:78.1198},
  {name:'Tiruchirappalli (Trichy)', type:'District', district:'Tiruchirappalli', state:'Tamil Nadu', pin:'620001', lat:10.7905, lng:78.7047},
  {name:'Salem', type:'District', district:'Salem', state:'Tamil Nadu', pin:'636001', lat:11.6643, lng:78.1460},

  // West Bengal
  {name:'Kolkata', type:'District', district:'Kolkata', state:'West Bengal', pin:'700001', lat:22.5726, lng:88.3639},
  {name:'Bidhannagar (Salt Lake)', type:'Sub-Division', district:'North 24 Parganas', state:'West Bengal', pin:'700091', lat:22.5804, lng:88.4190},
  {name:'Howrah', type:'District', district:'Howrah', state:'West Bengal', pin:'711101', lat:22.5958, lng:88.2636},
  {name:'Siliguri', type:'Sub-Division', district:'Darjeeling', state:'West Bengal', pin:'734001', lat:26.7271, lng:88.3953},
  {name:'Asansol / Durgapur', type:'Sub-Division', district:'Paschim Bardhaman', state:'West Bengal', pin:'713301', lat:23.6739, lng:86.9524},

  // Punjab, Haryana, Chandigarh, Uttarakhand, HP, J&K, Chhattisgarh, Jharkhand, Odisha, Assam, Kerala, Goa
  {name:'Chandigarh', type:'UT/City', district:'Chandigarh', state:'Chandigarh', pin:'160017', lat:30.7333, lng:76.7794},
  {name:'Ludhiana', type:'District', district:'Ludhiana', state:'Punjab', pin:'141001', lat:30.9010, lng:75.8573},
  {name:'Amritsar', type:'District', district:'Amritsar', state:'Punjab', pin:'143001', lat:31.6340, lng:74.8723},
  {name:'Jalandhar', type:'District', district:'Jalandhar', state:'Punjab', pin:'144001', lat:31.3260, lng:75.5762},
  {name:'Karnal', type:'District', district:'Karnal', state:'Haryana', pin:'132001', lat:29.6857, lng:76.9905},
  {name:'Panipat', type:'District', district:'Panipat', state:'Haryana', pin:'132103', lat:29.3909, lng:76.9635},
  {name:'Rohtak', type:'District', district:'Rohtak', state:'Haryana', pin:'124001', lat:28.8955, lng:76.6066},
  {name:'Dehradun', type:'District', district:'Dehradun', state:'Uttarakhand', pin:'248001', lat:30.3165, lng:78.0322},
  {name:'Haridwar', type:'District', district:'Haridwar', state:'Uttarakhand', pin:'249401', lat:29.9457, lng:78.1642},
  {name:'Shimla', type:'District', district:'Shimla', state:'Himachal Pradesh', pin:'171001', lat:31.1048, lng:77.1734},
  {name:'Srinagar', type:'District', district:'Srinagar', state:'Jammu & Kashmir', pin:'190001', lat:34.0837, lng:74.7973},
  {name:'Jammu', type:'District', district:'Jammu', state:'Jammu & Kashmir', pin:'180001', lat:32.7266, lng:74.8570},
  {name:'Raipur', type:'District', district:'Raipur', state:'Chhattisgarh', pin:'492001', lat:21.2514, lng:81.6296},
  {name:'Bilaspur', type:'District', district:'Bilaspur', state:'Chhattisgarh', pin:'495001', lat:22.0797, lng:82.1409},
  {name:'Ranchi', type:'District', district:'Ranchi', state:'Jharkhand', pin:'834001', lat:23.3441, lng:85.3096},
  {name:'Jamshedpur', type:'District/City', district:'East Singhbhum', state:'Jharkhand', pin:'831001', lat:22.8046, lng:86.2029},
  {name:'Dhanbad', type:'District', district:'Dhanbad', state:'Jharkhand', pin:'826001', lat:23.7957, lng:86.4304},
  {name:'Bhubaneswar', type:'District/City', district:'Khordha', state:'Odisha', pin:'751001', lat:20.2961, lng:85.8245},
  {name:'Cuttack', type:'District', district:'Cuttack', state:'Odisha', pin:'753001', lat:20.4625, lng:85.8828},
  {name:'Guwahati', type:'District/City', district:'Kamrup Metropolitan', state:'Assam', pin:'781001', lat:26.1445, lng:91.7362},
  {name:'Kochi (Ernakulam)', type:'District', district:'Ernakulam', state:'Kerala', pin:'682001', lat:9.9312, lng:76.2673},
  {name:'Aluva', type:'Taluk', district:'Ernakulam', state:'Kerala', pin:'683101', lat:10.1076, lng:76.3516},
  {name:'Thiruvananthapuram', type:'District', district:'Thiruvananthapuram', state:'Kerala', pin:'695001', lat:8.5241, lng:76.9366},
  {name:'Panaji', type:'District/City', district:'North Goa', state:'Goa', pin:'403001', lat:15.4909, lng:73.8278}
];

function resolveIndianPincode(pinStr){
  const cleanPin = pinStr.replace(/[^0-9]/g, '');
  if(!cleanPin || cleanPin.length < 3) return null;
  const found = INDIAN_CITIES_DB.find(item => item.pin === cleanPin);
  if(found) return found;
  const prefix2 = parseInt(cleanPin.slice(0,2));
  if(prefix2 === 11) return {name: `Delhi NCR (PIN ${cleanPin})`, type:'PIN Area', district:'Delhi', state:'Delhi', pin:cleanPin, lat:28.6139, lng:77.2090};
  if(prefix2 >= 12 && prefix2 <= 13) return {name: `Haryana Region (PIN ${cleanPin})`, type:'PIN Area', district:'Gurugram / Faridabad', state:'Haryana', pin:cleanPin, lat:28.4595, lng:77.0266};
  if(prefix2 >= 14 && prefix2 <= 16) return {name: `Punjab / Chandigarh (PIN ${cleanPin})`, type:'PIN Area', district:'Chandigarh / Punjab', state:'Punjab', pin:cleanPin, lat:30.7333, lng:76.7794};
  if(prefix2 === 17) return {name: `Himachal Pradesh (PIN ${cleanPin})`, type:'PIN Area', district:'Shimla', state:'Himachal Pradesh', pin:cleanPin, lat:31.1048, lng:77.1734};
  if(prefix2 >= 18 && prefix2 <= 19) return {name: `Jammu & Kashmir (PIN ${cleanPin})`, type:'PIN Area', district:'Srinagar', state:'Jammu & Kashmir', pin:cleanPin, lat:34.0837, lng:74.7973};
  if(prefix2 >= 20 && prefix2 <= 28) return {name: `Uttar Pradesh (PIN ${cleanPin})`, type:'PIN Area', district:'UP Region', state:'Uttar Pradesh', pin:cleanPin, lat:26.8467, lng:80.9462};
  if(prefix2 >= 30 && prefix2 <= 34) return {name: `Rajasthan (PIN ${cleanPin})`, type:'PIN Area', district:'Rajasthan Region', state:'Rajasthan', pin:cleanPin, lat:26.9124, lng:75.7873};
  if(prefix2 >= 36 && prefix2 <= 39) return {name: `Gujarat (PIN ${cleanPin})`, type:'PIN Area', district:'Gujarat Region', state:'Gujarat', pin:cleanPin, lat:23.0225, lng:72.5714};
  if(prefix2 >= 40 && prefix2 <= 44) return {name: `Maharashtra (PIN ${cleanPin})`, type:'PIN Area', district:'Maharashtra Region', state:'Maharashtra', pin:cleanPin, lat:19.0760, lng:72.8777};
  if(prefix2 >= 45 && prefix2 <= 49) return {name: `Madhya Pradesh (PIN ${cleanPin})`, type:'PIN Area', district:'MP / CG Region', state:'Madhya Pradesh', pin:cleanPin, lat:23.2599, lng:77.4126};
  if(prefix2 >= 50 && prefix2 <= 53) return {name: `Telangana / Andhra Pradesh (PIN ${cleanPin})`, type:'PIN Area', district:'Hyderabad / AP Region', state:'Telangana', pin:cleanPin, lat:17.3850, lng:78.4867};
  if(prefix2 >= 56 && prefix2 <= 59) return {name: `Karnataka (PIN ${cleanPin})`, type:'PIN Area', district:'Bengaluru / Karnataka Region', state:'Karnataka', pin:cleanPin, lat:12.9716, lng:77.5946};
  if(prefix2 >= 60 && prefix2 <= 64) return {name: `Tamil Nadu (PIN ${cleanPin})`, type:'PIN Area', district:'Chennai / TN Region', state:'Tamil Nadu', pin:cleanPin, lat:13.0827, lng:80.2707};
  if(prefix2 >= 67 && prefix2 <= 69) return {name: `Kerala (PIN ${cleanPin})`, type:'PIN Area', district:'Kochi / Kerala Region', state:'Kerala', pin:cleanPin, lat:9.9312, lng:76.2673};
  if(prefix2 >= 70 && prefix2 <= 74) return {name: `West Bengal (PIN ${cleanPin})`, type:'PIN Area', district:'Kolkata / WB Region', state:'West Bengal', pin:cleanPin, lat:22.5726, lng:88.3639};
  if(prefix2 >= 75 && prefix2 <= 77) return {name: `Odisha (PIN ${cleanPin})`, type:'PIN Area', district:'Bhubaneswar / Odisha', state:'Odisha', pin:cleanPin, lat:20.2961, lng:85.8245};
  if(prefix2 >= 78 && prefix2 <= 79) return {name: `Assam & North East (PIN ${cleanPin})`, type:'PIN Area', district:'Guwahati', state:'Assam', pin:cleanPin, lat:26.1445, lng:91.7362};
  if(prefix2 >= 80 && prefix2 <= 85) return {name: `Bihar / Jharkhand (PIN ${cleanPin})`, type:'PIN Area', district:'Patna / Ranchi', state:'Bihar', pin:cleanPin, lat:25.5941, lng:85.1376};
  return null;
}

function searchIndianTehsilsAndDistricts(query){
  if(!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  return INDIAN_CITIES_DB.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.district.toLowerCase().includes(q) || 
    c.state.toLowerCase().includes(q) ||
    c.pin.includes(q)
  ).slice(0, 8);
}


const hiHtml={
  heroTitle:'आज हम आपकी<br /><em>क्या मदद कर सकते हैं?</em>',
  heroText:'अपने लिए सही रास्ता चुनें। घर के लिए भरोसेमंद कामगार खोजें, या काम पाएँ, अपने हुनर को बढ़ाएँ और अधिक कमाएँ।',
  specialTitle:'अच्छा डिज़ाइन केवल<br /><em>महंगे घरों के लिए नहीं होना चाहिए।</em>',
  findTitle:'बेहतरीन काम की शुरुआत<br /><em>सही लोगों से होती है।</em>',
  rankTitle:'हुनर को केवल सितारों से<br /><em>ज्यादा मिलना चाहिए।</em>',
  designTitle:'सुंदर विचार।<br /><em>बनाने योग्य जानकारी।</em>',
  guideTitle:'हर जानकारी,<br /><em>अब और स्पष्ट।</em>',
  safetyTitle:'स्पष्ट, निष्पक्ष और<br /><em>हमेशा सुरक्षित।</em>',
  finalTitle:'बेहतर कुछ बनाने के लिए<br /><em>तैयार हैं?</em>'
};
const modalHindi={
  'HIRE A LABOURER / 01':'कामगार रखें / 01','Find trusted people nearby.':'पास के भरोसेमंद कामगार खोजें।','We always show nearby skilled workers first. If you choose someone farther away, the fair travel support is shown clearly before you hire.':'हम पहले पास के कुशल कामगार दिखाते हैं। दूर के कामगार को चुनने पर यात्रा सहायता पहले ही साफ दिखाई जाती है।','TYPE OF WORK':'काम का प्रकार','WHEN DO YOU NEED IT?':'काम कब चाहिए?','WORK LOCATION':'काम की जगह','DESCRIBE THE REQUIREMENT':'काम की जानकारी','See nearby matches':'पास के कामगार देखें','FIND A JOB / 01':'काम खोजें / 01','Start working with respect.':'सम्मान के साथ काम शुरू करें।','YOUR NAME':'आपका नाम','PHONE NUMBER':'फोन नंबर (10 अंक)','YOUR MAIN SKILL':'आपका मुख्य हुनर','EXPERIENCE':'अनुभव','AADHAAR VERIFICATION':'आधार सत्यापन','Continue in my language':'मेरी भाषा में आगे बढ़ें','FIND A JOB / 02':'काम खोजें / 02','Learn. Build. Earn more.':'सीखें। बनाएँ। अधिक कमाएँ।','How Nirmaan works — हिन्दी':'निर्मान कैसे काम करता है — हिन्दी','I understand — show me jobs':'समझ गया — काम दिखाएँ','YOU ARE NOW AVAILABLE':'आप अब उपलब्ध हैं','Customers near you can find you.':'आपके पास के ग्राहक आपको खोज सकते हैं।','Finish onboarding':'पंजीकरण पूरा करें','Safe payment:':'सुरक्षित भुगतान:','Nearby-first matching:':'पहले पास का मिलान:','SPECIAL HOME / EXPLORE SPACES':'विशेष घर / जगह देखें','Suggested Diamond + VIP design crew':'सुझाई गई डायमंड + VIP डिज़ाइन टीम','Get this team & estimate':'टीम और अनुमान पाएँ','Request this crew':'इस टीम को चुनें','Request sent':'अनुरोध भेज दिया गया','What needs to get done?':'कौन सा काम करवाना है?','As soon as possible':'जितनी जल्दी हो सके','This week':'इस सप्ताह','Choose a date':'तारीख चुनें','Woodwork / Carpenter':'लकड़ी का काम / बढ़ई','Masonry / Mason':'मिस्त्री / राजमिस्त्री','Painting':'पेंटिंग','Electrical':'बिजली का काम','Plumbing':'प्लंबिंग','Find my matches':'मेरे लिए कामगार खोजें','Your full name':'आपका पूरा नाम','10-digit mobile number':'10 अंकों का मोबाइल नंबर','Last 4 digits only — verified securely later':'केवल अंतिम 4 अंक — सुरक्षित सत्यापन बाद में','New to this work':'इस काम में नए हैं (0-1 वर्ष)','1–3 years':'1–3 वर्ष','4–8 years':'4–8 वर्ष','8+ years':'8+ वर्ष'
};

function tr(en,hi){return currentLanguage==='hi'?hi:en;}
function localizeModal(html){if(currentLanguage!=='hi')return html;return Object.entries(modalHindi).reduce((value,[en,hi])=>value.split(en).join(hi),html);}
function workerRole(worker){const roles={arjun:'मास्टर बढ़ई',meera:'फिनिश पेंटर',sameer:'राजमिस्त्री प्रो',dev:'इलेक्ट्रीशियन',anita:'टाइल विशेषज्ञ',ravi:'प्लंबिंग विशेषज्ञ'};return currentLanguage==='hi'?(roles[worker.id]||worker.role):worker.role;}
function workerSkills(worker){const skills={arjun:'कस्टम फर्नीचर · अलमारी',meera:'टेक्सचर · रंग सलाह',sameer:'ईंट का काम · प्लास्टरिंग',dev:'वायरिंग · स्मार्ट होम',anita:'बाथरूम · फर्श टाइलिंग',ravi:'पाइपिंग · फिटिंग'};return currentLanguage==='hi'?(skills[worker.id]||worker.skills):worker.skills;}
function rankLabel(rank){const ranks={SILVER:'सिल्वर',GOLD:'गोल्ड',DIAMOND:'डायमंड',VIP:'VIP',PRO:'प्रो'};return currentLanguage==='hi'?(ranks[rank]||rank):rank;}
function distanceLabel(distance){return currentLanguage==='hi'?String(distance).replace(' km away',' किमी दूर'):distance;}
function jobsLabel(jobs){return currentLanguage==='hi'?String(jobs).replace(' jobs',' काम'):jobs;}
function setText(selector,en,hi){const el=document.querySelector(selector);if(el)el.innerHTML=tr(en,hi);}

function calculateRankData(w){
  let jobsCount=parseInt(String(w.jobs||'0').replace(/[^0-9]/g,''))||0;
  let ratingVal=parseFloat(w.rating)||5.0;
  // All new workers start at Silver (15 pts base). They rank up strictly through completed jobs and high ratings!
  let baseScore = Math.min(100, Math.round(15 + (jobsCount * 14) + ((ratingVal - 4.0) * 10)));
  if(w.id==='arjun'||w.id==='sameer'||w.id==='ravi'){
    baseScore = Math.max(baseScore, w.rank==='VIP'?95:w.rank==='DIAMOND'?78:55);
  }
  let rank='SILVER',cls='silver',nextRank='GOLD',nextTarget=40;
  if(baseScore>=90){rank='VIP';cls='pro';nextRank='TOP MASTER';nextTarget=100;}
  else if(baseScore>=70){rank='DIAMOND';cls='diamond';nextRank='VIP';nextTarget=90;}
  else if(baseScore>=40){rank='GOLD';cls='gold';nextRank='DIAMOND';nextTarget=70;}
  let progressPercent=Math.min(100,Math.max(12,baseScore));
  return {rank,cls,nextRank,score:baseScore,progressPercent,jobsCount,ratingVal};
}


function updateHeaderProfile(){
  const container=document.getElementById('userProfileContainer');
  const loginBtn=document.getElementById('loginBtn');
  const findJobBtn=document.querySelector('[data-open="work"]');
  if(!container)return;

  if(currentLoggedWorker){
    if(loginBtn)loginBtn.style.display='none';
    if(findJobBtn)findJobBtn.style.display='';
    const rankInfo=calculateRankData(currentLoggedWorker);
    const hasPhoto=currentLoggedWorker.image&&(currentLoggedWorker.image.startsWith('data:')||currentLoggedWorker.image.startsWith('http'));
    container.innerHTML=`
      <a href="worker-dashboard.html" class="user-profile-btn" title="${tr('View my worker dashboard','मेरा वर्कर डैशबोर्ड देखें')}" style="text-decoration:none">
        ${hasPhoto?`<img src="${currentLoggedWorker.image}" alt="${currentLoggedWorker.name}"/>`:`<div style="width:36px;height:36px;border-radius:50%;background:#2e4c3a;display:flex;align-items:center;justify-content:center;font-size:18px">👷</div>`}
        <div class="user-info">
          <span class="user-name">${(currentLoggedWorker.name||'Worker').split(' ')[0]}</span>
          <span class="user-rank">${rankLabel(rankInfo.rank)} · ${tr(currentLoggedWorker.category||'Pro',currentLoggedWorker.category||'प्रो')}</span>
        </div>
        <span class="status-dot" style="background:${currentLoggedWorker.available!==false?'#27ae60':'#e67e22'}"></span>
      </a>
    `;
  } else if(currentLoggedCustomer){
    if(loginBtn)loginBtn.style.display='none';
    // Hide "Find a job" for customers
    if(findJobBtn)findJobBtn.style.display='none';
    const hasPhoto=currentLoggedCustomer.image&&(currentLoggedCustomer.image.startsWith('data:')||currentLoggedCustomer.image.startsWith('http'));
    container.innerHTML=`
      <button onclick="showCustomerProfilePopup()" style="display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;padding:4px 6px;border-radius:50px;transition:background .2s" onmouseover="this.style.background='#f0f4ee'" onmouseout="this.style.background='none'" title="Your profile">
        <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;background:#eef3eb;border:2px solid #d6f35d;display:flex;align-items:center;justify-content:center;font-size:18px">
          ${hasPhoto?`<img src="${currentLoggedCustomer.image}" style="width:100%;height:100%;object-fit:cover" alt="${currentLoggedCustomer.name}"/>`:'🏠'}
        </div>
      </button>
    `;
  } else {
    if(loginBtn)loginBtn.style.display='inline-block';
    if(findJobBtn)findJobBtn.style.display='';
    container.innerHTML='';
  }
}


function applyLanguage(language){
  currentLanguage=language;document.documentElement.lang=language==='hi'?'hi':'en';document.body.classList.toggle('hi-language',language==='hi');
  const nav=document.querySelectorAll('nav a');['Find pros','Home designs','For professionals','Safety','Contact: +91 90000 00000'].forEach((en,i)=>{if(nav[i])nav[i].textContent=language==='hi'?['कामगार खोजें','घर के डिज़ाइन','पेशेवरों के लिए','सुरक्षा','संपर्क: +91 90000 00000'][i]:en});
  const lb=document.getElementById('loginBtn');if(lb)lb.textContent=tr('Sign in','साइन इन');document.getElementById('languageSwitch').textContent=language==='hi'?'English':'हिन्दी';
  document.querySelectorAll('[data-open="post"]').forEach(el=>{el.innerHTML=tr('Post a job <span>↗</span>','कामगार रखें <span>↗</span>');});
  setText('.hero-copy h1','What can we help<br /><em>you build today?</em>',hiHtml.heroTitle);setText('.hero-copy>p','Choose your path. Hire trusted hands for your home, or find dignified work and grow your skills with Nirmaan.',hiHtml.heroText);
  const pathCards=document.querySelectorAll('.path-card');if(pathCards[0])pathCards[0].innerHTML=tr('<span class="path-icon">⌂</span><span><b>Hire a labourer</b><small>Find nearby, verified professionals</small></span><strong>→</strong>','<span class="path-icon">⌂</span><span><b>कामगार रखें</b><small>पास के सत्यापित पेशेवर खोजें</small></span><strong>→</strong>');if(pathCards[1])pathCards[1].innerHTML=tr('<span class="path-icon">✦</span><span><b>Find a job</b><small>Join, train and earn more</small></span><strong>→</strong>','<span class="path-icon">✦</span><span><b>काम खोजें</b><small>जुड़ें, सीखें और अधिक कमाएँ</small></span><strong>→</strong>');
  setText('.hero-design-link','<span class="play">▶</span> Explore affordable special homes','<span class="play">▶</span> किफायती विशेष घर देखें');
  setText('.motto-strip blockquote','“Dignity for every hand. Confidence in every home.”','“हर हाथ को सम्मान। हर घर को भरोसा।”');setText('.motto-strip p','Our promise: meaningful work for skilled people, and dependable craftsmanship for every family.','हमारा वादा: कुशल लोगों के लिए सम्मानजनक काम, और हर परिवार के लिए भरोसेमंद निर्माण।');
  setText('.special-intro h2','Good design should not<br /><em>be only for expensive homes.</em>',hiHtml.specialTitle);setText('.special-intro p','Choose a house style you love. See the outside, rooms and special spaces — then get a clear build estimate and a team that knows how to execute it.','अपनी पसंद का घर चुनें। बाहर, कमरे और विशेष जगहें देखें — फिर स्पष्ट अनुमान और उसे बनाने वाली प्रशिक्षित टीम पाएँ।');setText('.special-intro .arrow-link','Browse all home ideas <span>→</span>','घर के सभी विचार देखें <span>→</span>');
  const homeTitles=['The Courtyard Home','Warm Minimal','The Green Terrace'];document.querySelectorAll('.home-tile b').forEach((el,i)=>el.textContent=language==='hi'?['आंगन वाला घर','सादा और सुंदर','हरित टेरेस'][i]:homeTitles[i]);
  setText('.find .section-heading h2','Great work starts with<br /><em>the right people.</em>',hiHtml.findTitle);setText('.find .section-heading p','Choose a specialist, compare transparent credentials, or assemble a highly rated team with one tap.','विशेषज्ञ चुनें, उनके काम और दरों की तुलना करें, या एक टैप में बेहतरीन टीम बनाएँ।');
  const serviceNames=['All professionals','Woodwork','Masonry','Painting','Electrical','Plumbing'];document.querySelectorAll('.service-tabs button').forEach((el,i)=>el.textContent=language==='hi'?['सभी पेशेवर','लकड़ी का काम','राजमिस्त्री','पेंटिंग','बिजली','प्लंबिंग'][i]:serviceNames[i]);
  const trades=[['Mason','Brickwork & plaster'],['Carpenter','Woodwork & furniture'],['Painter','Colour & textures'],['Electrician','Wiring & fixtures'],['Plumber','Pipes & fittings']];document.querySelectorAll('.trade-gallery button').forEach((el,i)=>{const b=el.querySelector('b'),s=el.querySelector('small');if(b)b.textContent=language==='hi'?['राजमिस्त्री','बढ़ई','पेंटर','इलेक्ट्रीशियन','प्लंबर'][i]:trades[i][0];if(s)s.textContent=language==='hi'?['ईंट और प्लास्टर','लकड़ी और फर्नीचर','रंग और टेक्सचर','वायरिंग और फिटिंग','पाइप और फिटिंग'][i]:trades[i][1];});
  setText('.rank-copy h2','Skill should earn<br /><em>more than stars.</em>',hiHtml.rankTitle);setText('.design-section .section-heading h2','Beautiful ideas.<br /><em>Buildable details.</em>',hiHtml.designTitle);setText('.guide-copy h2','Every detail,<br /><em>made clearer.</em>',hiHtml.guideTitle);setText('.safety-intro h2','Clear, fair, and<br /><em>safe by default.</em>',hiHtml.safetyTitle);setText('.final-cta h2','Ready to build<br /><em>something better?</em>',hiHtml.finalTitle);
  setText('.design-section .section-heading .kicker','DESIGN THAT GETS BUILT WELL','ऐसा डिज़ाइन जो अच्छी तरह बने');setText('.design-section .section-heading p','Architect-led plans transformed into simple, visual step-by-step guides your trained Nirmaan Pro crew can confidently execute.','आर्किटेक्ट के प्लान को आसान, चित्रों वाली चरण-दर-चरण गाइड में बदला जाता है, ताकि आपकी प्रशिक्षित निर्मान प्रो टीम उसे भरोसे से बना सके।');
  setText('.rank-copy .kicker','EARN YOUR CRAFT','अपने हुनर से कमाएँ');setText('.rank-copy p','Our Progress Rank recognizes the work behind the work. Pros rise through verified projects, reliability, training and on-site quality checks — unlocking better projects and higher pay.','हमारा प्रोग्रेस रैंक आपके असली काम को पहचानता है। सत्यापित प्रोजेक्ट, भरोसेमंदी, प्रशिक्षण और साइट की गुणवत्ता जांच से आप आगे बढ़ते हैं — और बेहतर प्रोजेक्ट व अधिक कमाई पाते हैं।');
  document.querySelectorAll('.rank-chip').forEach((el,i)=>{el.innerHTML=language==='hi'?['सिल्वर <span>◆</span>','गोल्ड <span>◆</span>','डायमंड <span>◆</span>','VIP <span>✦</span>'][i]:['SILVER <span>◆</span>','GOLD <span>◆</span>','DIAMOND <span>◆</span>','VIP <span>✦</span>'][i];});setText('.rank-center','<span>✦</span><b>PRO</b><small>verified</small>','<span>✦</span><b>प्रो</b><small>सत्यापित</small>');
  setText('.team-builder .kicker','SMART CREW','स्मार्ट टीम');setText('.team-builder h3','Build a dream team,<br />not a guess.','अनुमान नहीं,<br />सपनों की टीम बनाएँ।');setText('.team-builder p','Tell us the scope. Our matching engine balances skill, ratings, cost and availability.','काम की जानकारी दें। हमारा मैचिंग सिस्टम हुनर, रेटिंग, लागत और उपलब्धता का सही संतुलन बनाता है।');
  setText('.guide-copy .kicker','NIRMAAN GUIDE','निर्मान गाइड');setText('.guide-copy p','Your crew gets a pocket-sized, multilingual execution guide built from the architect\'s plan — with dimensions, materials, visual checks and support when they need it.','आपकी टीम को आर्किटेक्ट के प्लान से बनी सरल, बहुभाषी कार्य गाइड मिलती है — माप, सामग्री, तस्वीरों वाली जांच और जरूरत पर सहायता के साथ।');setText('#guideBtn','Try the site guide <span>→</span>','साइट गाइड आज़माएँ <span>→</span>');
  setText('.safety-intro .kicker','BUILT ON TRUST','भरोसे पर बनाया गया');
  updateHeaderProfile();
  renderWorkers(document.querySelector('.service-tabs .active')?.dataset.service||'All professionals');
}

const languageModal=document.getElementById('languageModal');
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{applyLanguage(button.dataset.language);languageModal.classList.add('hidden');}));
document.getElementById('languageSwitch').addEventListener('click',()=>languageModal.classList.remove('hidden'));

const proGrid=document.getElementById('proGrid');
function renderWorkers(filter='All professionals'){
  const set=filter==='All professionals'?workers:workers.filter(w=>w.category===filter);
  const visible=set.length?set:workers;
  proGrid.innerHTML=visible.slice(0,6).map(w=>`
    <article class="pro-card">
      <div class="pro-top">
        <img src="${w.image}" alt="${w.name}"/>
        <div>
          <h3>${w.name}</h3>
          <p>${workerRole(w)} · ${distanceLabel(w.distance)}</p>
        </div>
        <span class="mini-rank ${w.cls}">${rankLabel(w.rank)}</span>
      </div>
      <div class="pro-meta">
        <span><b>${w.rating} ★</b> · ${jobsLabel(w.jobs)}</span>
        <span>${currentLanguage==='hi'?w.rate.replace('/day','/दिन'):w.rate}</span>
      </div>
      <button data-worker="${w.id}">${tr('Check availability →','उपलब्धता देखें →')}</button>
    </article>
  `).join('');
}
renderWorkers();
updateHeaderProfile();

function setService(filter){document.querySelectorAll('.service-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.service===filter));renderWorkers(filter);document.getElementById('proGrid').scrollIntoView({behavior:'smooth',block:'nearest'});}
document.querySelectorAll('[data-service]').forEach(btn=>btn.addEventListener('click',()=>setService(btn.dataset.service)));

const modal=document.getElementById('modal');
const modalContent=document.getElementById('modalContent');
function openModal(content,afterRender){modalContent.innerHTML=localizeModal(content);modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';const form=modalContent.querySelector('form');if(form)form.addEventListener('submit',handleFormSubmit);if(afterRender)requestAnimationFrame(()=>setTimeout(afterRender,120));}
function closeModal(){
  stopCameraStream();
  if(currentMap){currentMap.remove();currentMap=null;}
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));

function postForm(){return `<div class="step">HIRE A LABOURER / 01</div><h2 id="modalTitle">Find trusted people nearby.</h2><p>We always show nearby skilled workers first. If you choose someone farther away, the fair travel support is shown clearly before you hire.</p><div class="crew-choice"><button type="button" data-team-builder="4">${tr('Need more than one person?','एक से अधिक लोग चाहिए?')}<br /><strong>${tr('Build my crew →','मेरी टीम बनाएँ →')}</strong></button><button type="button" data-team-builder="10">${tr('Planning a larger job?','बड़ा काम है?')}<br /><strong>${tr('See quick teams →','तुरंत टीम देखें →')}</strong></button></div><form id="jobForm"><div class="form-grid"><div class="field"><label>TYPE OF WORK</label><select><option>Woodwork / Carpenter</option><option>Masonry / Mason</option><option>Painting</option><option>Electrical</option><option>Plumbing</option></select></div><div class="field"><label>WHEN DO YOU NEED IT?</label><select><option>As soon as possible</option><option>This week</option><option>Choose a date</option></select></div><div class="field full"><label>WORK LOCATION</label><input value="Indiranagar, Bengaluru" aria-label="Work location" required /></div><div class="field full"><label>DESCRIBE THE REQUIREMENT</label><textarea placeholder="e.g. Need a mason for a boundary wall"></textarea></div></div><button class="button button-dark" type="submit">See nearby matches <span>→</span></button></form>`}

const crewRoles=[
  {id:'mason',icon:'▦',name:'Mason',hi:'राजमिस्त्री',desc:'Brickwork & plaster',hiDesc:'ईंट और प्लास्टर',rate:1100},
  {id:'carpenter',icon:'⌂',name:'Carpenter',hi:'बढ़ई',desc:'Woodwork & furniture',hiDesc:'लकड़ी और फर्नीचर',rate:1250},
  {id:'painter',icon:'◫',name:'Painter',hi:'पेंटर',desc:'Colour & finishing',hiDesc:'रंग और फिनिशिंग',rate:1050},
  {id:'electrician',icon:'ϟ',name:'Electrician',hi:'इलेक्ट्रीशियन',desc:'Wiring & fixtures',hiDesc:'वायरिंग और फिटिंग',rate:1100},
  {id:'plumber',icon:'⌁',name:'Plumber',hi:'प्लंबर',desc:'Pipes & fittings',hiDesc:'पाइप और फिटिंग',rate:1050},
  {id:'helper',icon:'●',name:'General labourer',hi:'सामान्य मजदूर',desc:'Site help & materials',hiDesc:'साइट सहायता और सामग्री',rate:700}
];
let teamCounts={mason:1,carpenter:1,painter:0,electrician:0,plumber:0,helper:2};
const teamPresets={4:{mason:1,carpenter:1,painter:0,electrician:0,plumber:0,helper:2},10:{mason:2,carpenter:2,painter:1,electrician:1,plumber:0,helper:4},20:{mason:4,carpenter:3,painter:2,electrician:2,plumber:1,helper:8}};
function teamTotal(){return Object.values(teamCounts).reduce((sum,count)=>sum+count,0)}
function teamCost(){return crewRoles.reduce((sum,role)=>sum+(teamCounts[role.id]*role.rate),0)}
function teamBuilderHtml(){const total=teamTotal(),cost=teamCost();return `<div class="team-modal-head"><div class="step">${tr('SMART CREW BUILDER','स्मार्ट टीम बिल्डर')}</div><h2 id="modalTitle">${tr('Build the crew your work needs.','काम के अनुसार अपनी टीम बनाएँ।')}</h2><p>${tr('Add skilled specialists and general labourers. We will match verified people nearby and show one clear daily estimate.','कुशल विशेषज्ञ और सामान्य मजदूर जोड़ें। हम पास के सत्यापित लोगों को मिलाएँगे और एक स्पष्ट दैनिक अनुमान दिखाएँगे।')}</p></div><div class="quick-teams"><button class="quick-team" data-quick-team="4"><strong>${tr('Small crew · 4','छोटी टीम · 4')}</strong><small>${tr('1 mason, 1 carpenter, 2 helpers','1 राजमिस्त्री, 1 बढ़ई, 2 मजदूर')}</small></button><button class="quick-team" data-quick-team="10"><strong>${tr('Project crew · 10','प्रोजेक्ट टीम · 10')}</strong><small>${tr('Specialists + 4 helpers','विशेषज्ञ + 4 मजदूर')}</small></button><button class="quick-team" data-quick-team="20"><strong>${tr('Site crew · 20','बड़ी साइट टीम · 20')}</strong><small>${tr('Full trade team + 8 helpers','पूरी विशेषज्ञ टीम + 8 मजदूर')}</small></button></div><div class="team-builder-list">${crewRoles.map(role=>`<div class="team-row"><span class="trade-icon">${role.icon}</span><div><b>${tr(role.name,role.hi)}</b><small>${tr(role.desc,role.hiDesc)} · ₹${role.rate}${tr('/day','/दिन')}</small></div><div class="counter"><button data-team-adjust="${role.id}" data-change="-1" aria-label="Remove one">−</button><span id="count-${role.id}">${teamCounts[role.id]}</span><button data-team-adjust="${role.id}" data-change="1" aria-label="Add one">+</button></div></div>`).join('')}</div><div class="team-summary"><div><small>${tr('YOUR CREW','आपकी टीम')}</small><b><span id="teamTotal">${total}</span> ${tr('people','लोग')}</b></div><strong>₹<span id="teamCost">${cost.toLocaleString('en-IN')}</span>${tr('/day','/दिन')}</strong></div><div class="team-modal-actions"><small>${tr('Daily estimate includes all selected people. You can review individual rates before confirming.','दैनिक अनुमान में चुने हुए सभी लोग शामिल हैं। पुष्टि से पहले आप हर व्यक्ति की दर देख सकते हैं।')}</small><button class="button button-dark" id="createCustomCrew">${tr('Find this crew','यह टीम खोजें')} <span>→</span></button></div>`}
function openTeamBuilder(size=4){teamCounts={...teamPresets[size]};openModal(teamBuilderHtml())}
function refreshTeamBuilder(){const total=teamTotal(),cost=teamCost();crewRoles.forEach(role=>{const value=document.getElementById(`count-${role.id}`);if(value)value.textContent=teamCounts[role.id]});const totalEl=document.getElementById('teamTotal'),costEl=document.getElementById('teamCost');if(totalEl)totalEl.textContent=total;if(costEl)costEl.textContent=cost.toLocaleString('en-IN')}

function workerStart(){
  regPhotoData='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=180&q=80';
  return `
    <div class="step">${tr('FIND A JOB / CREATE PROFILE','काम खोजें / प्रोफ़ाइल बनाएँ')}</div>
    <h2 id="modalTitle">${tr('Register as a Professional','पेशेवर के रूप में पंजीकरण करें')}</h2>
    <p>${tr('Take a live photo, enter verified details and pin your location to start at Silver rank and unlock jobs.','लाइव फोटो लें, सत्यापित विवरण दर्ज करें और सिल्वर रैंक से शुरू करके काम पाएँ।')}</p>
    
    <div class="photo-upload-box">
      <div class="photo-preview" id="regPhotoPreview">
        <img src="${regPhotoData}" id="previewImg" alt="Worker profile" />
      </div>
      <div style="flex:1">
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <button type="button" class="photo-upload-btn" id="openLiveCameraBtn" style="background:#1e553d;color:#d6f35d;border:0">📸 ${tr('Take Live Photo','लाइव फोटो लें')}</button>
          <label class="photo-upload-btn" for="photoFileInput" style="background:#32443c">📁 ${tr('Choose File','फाइल से चुनें')}</label>
          <input type="file" id="photoFileInput" accept="image/*" style="display:none" />
        </div>
        <div class="photo-hint">${tr('Take a clear live selfie photo to instantly verify your profile','प्रोफ़ाइल तुरंत सत्यापित करने के लिए साफ लाइव सेल्फी फोटो लें')}</div>
      </div>
    </div>

    <!-- Live Camera Container -->
    <div id="liveCameraContainer" style="display:none" class="camera-box">
      <div style="font-size:12px;margin-bottom:8px;font-weight:600">📷 ${tr('Position your face in front of the camera','कैमरे के सामने अपना चेहरा रखें')}</div>
      <video id="liveCameraVideo" autoplay playsinline class="camera-video"></video>
      <canvas id="liveCameraCanvas" style="display:none"></canvas>
      <div class="camera-actions">
        <button type="button" class="camera-btn camera-btn-capture" id="snapPhotoBtn">📸 ${tr('Capture Photo Now','फोटो खींचें')}</button>
        <button type="button" class="camera-btn camera-btn-cancel" id="cancelCameraBtn">${tr('Cancel','रद्द करें')}</button>
      </div>
    </div>

    <div id="workerFormError" class="worker-form-error-banner"></div>

    <form id="workerForm" novalidate>
      <div class="form-grid">
        <div class="field">
          <label>${tr('YOUR FULL NAME','आपका पूरा नाम')}</label>
          <input id="workerNameInput" placeholder="${tr('e.g. Ramesh Kumar','उदा. रमेश कुमार')}" autocomplete="name" required />
        </div>
        <div class="field">
          <label>${tr('10-DIGIT MOBILE NUMBER','10 अंकों का मोबाइल नंबर')}</label>
          <input type="tel" id="workerPhoneInput" maxlength="10" placeholder="${tr('9876543210 (10 digits)','9876543210 (10 अंक)')}" autocomplete="tel" required />
        </div>
        <div class="field">
          <label>${tr('YOUR MAIN TRADE / SKILL','आपका मुख्य हुनर')}</label>
          <select id="workerTradeSelect">
            <option value="Carpenter">${tr('Carpenter / Woodwork','बढ़ई / लकड़ी का काम')}</option>
            <option value="Mason">${tr('Mason / Rajmistri','राजमिस्त्री / ईंट का काम')}</option>
            <option value="Painter">${tr('Painter / Texture','पेंटर / रंग-रोगन')}</option>
            <option value="Electrician">${tr('Electrician / Wiring','इलेक्ट्रीशियन / वायरिंग')}</option>
            <option value="Plumber">${tr('Plumber / Piping','प्लंबर / पाइपिंग')}</option>
          </select>
        </div>
        <div class="field">
          <label>${tr('EXPERIENCE IN TRADE','काम का अनुभव')}</label>
          <select id="workerExpSelect">
            <option value="1–3 years">${tr('1–3 years','1–3 वर्ष')}</option>
            <option value="4–8 years" selected>${tr('4–8 years','4–8 वर्ष')}</option>
            <option value="8+ years">${tr('8+ years','8+ वर्ष')}</option>
          </select>
        </div>
        <div class="field full">
          <div style="background:#eaf2e5;padding:8px 12px;border-radius:6px;font-size:11px;color:#244c33;display:flex;align-items:center;gap:7px">
            <span style="font-size:14px">◆</span>
            <span><b>${tr('Starting Rank: SILVER','शुरुआती रैंक: सिल्वर')}</b> — ${tr('You start at Silver. Your rank upgrades to Gold, Diamond & VIP as you complete jobs and earn 5★ ratings!','आप सिल्वर से शुरू करते हैं। जैसे-जैसे आप काम पूरा करते हैं और 5★ रेटिंग पाते हैं, आपकी रैंक गोल्ड, डायमंड और VIP में अपग्रेड होगी!')}</span>
          </div>
        </div>
        <div class="field full">
          <label>${tr('AADHAAR VERIFICATION (LAST 4 DIGITS ONLY)','आधार सत्यापन (केवल अंतिम 4 अंक)')}</label>
          <div class="input-with-badge">
            <input type="text" id="workerAadhaarInput" maxlength="4" placeholder="${tr('e.g. 5892 (Last 4 digits)','उदा. 5892 (अंतिम 4 अंक)')}" value="" required />
            <span class="verify-status-badge" id="aadhaarBadge" style="display:none">✓ ${tr('VERIFIED','सत्यापित')}</span>
          </div>
          <small style="font-size:10px;color:#67776f;margin-top:4px">${tr('For privacy, only enter the last 4 digits of your Aadhaar card.','गोपनीयता व सुरक्षा के लिए, केवल अपने आधार कार्ड के अंतिम 4 अंक दर्ज करें।')}</small>
        </div>
        <div class="field full">
          <label>${tr('PIN CODE / TEHSIL / CITY / DISTRICT ADDRESS','पिन कोड / तहसील / शहर / जिला का पता')}</label>
          <div class="location-input-wrap">
            <input id="workerLocInput" placeholder="${tr('Type 6-digit PIN code, Tehsil, District, or City name...','6 अंकों का पिन कोड, तहसील, जिला या शहर का नाम लिखें...')}" autocomplete="off" required />
            <div id="pincodeResolvedTag" class="pincode-resolved-tag">
              <span id="resolvedLocText"></span>
            </div>
            <div id="citySuggestionsDropdown" class="city-suggestions-dropdown"></div>
          </div>
          <button type="button" class="location-picker-btn" id="detectGpsBtn" style="margin-top:8px">📍 ${tr('Detect My GPS Location','मेरी वर्तमान लोकेशन लें')}</button>
          <div id="regMapContainer" class="reg-map-large"></div>
        </div>
      </div>
      <button class="button button-dark full" id="workerSubmitBtn" type="submit" style="justify-content:center;font-size:14px">${tr('Continue to Skill Assessment','हुनर सत्यापन में आगे बढ़ें')} <span>→</span></button>
    </form>
  `;
}

function initRegMap(){
  // Live camera triggers
  const openCamBtn=document.getElementById('openLiveCameraBtn');
  const camBox=document.getElementById('liveCameraContainer');
  const videoEl=document.getElementById('liveCameraVideo');
  const canvasEl=document.getElementById('liveCameraCanvas');
  const snapBtn=document.getElementById('snapPhotoBtn');
  const cancelCamBtn=document.getElementById('cancelCameraBtn');

  if(openCamBtn && camBox && videoEl){
    openCamBtn.addEventListener('click', async ()=>{
      try {
        stopCameraStream();
        camBox.style.display='block';
        cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 400 }, height: { ideal: 400 } }
        });
        videoEl.srcObject = cameraStream;
        videoEl.play();
      } catch (err) {
        console.warn('Camera error:', err);
        camBox.style.display='none';
        alert(tr('Camera access unavailable. Please use file upload instead.','कैमरा एक्सेस उपलब्ध नहीं है। कृपया फाइल अपलोड विकल्प का उपयोग करें।'));
      }
    });

    if(snapBtn){
      snapBtn.addEventListener('click', ()=>{
        if(!videoEl.videoWidth){
          alert(tr('Camera loading, please try in a moment.','कैमरा लोड हो रहा है, कृपया एक सेकंड बाद प्रयास करें।'));
          return;
        }
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
        const ctx = canvasEl.getContext('2d');
        ctx.translate(canvasEl.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
        regPhotoData = canvasEl.toDataURL('image/jpeg', 0.85);
        const img = document.getElementById('previewImg');
        if(img) img.src = regPhotoData;
        stopCameraStream();
        camBox.style.display='none';
        showToast(tr('Photo Captured!','फोटो ले ली गई!'),tr('Live photo saved successfully.','लाइव फोटो सफलतापूर्वक सेव हो गई।'));
      });
    }

    if(cancelCamBtn){
      cancelCamBtn.addEventListener('click', ()=>{
        stopCameraStream();
        camBox.style.display='none';
      });
    }
  }

  // File upload trigger
  const fileInput=document.getElementById('photoFileInput');
  if(fileInput){
    fileInput.addEventListener('change',e=>{
      const file=e.target.files[0];
      if(file){
        const reader=new FileReader();
        reader.onload=ev=>{
          regPhotoData=ev.target.result;
          const img=document.getElementById('previewImg');
          if(img)img.src=regPhotoData;
          showToast(tr('Photo Uploaded','फोटो अपलोड हुई'),tr('Profile photo ready.','प्रोफ़ाइल फोटो तैयार है।'));
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Clear form errors helper
  function clearErrors(){
    const errBanner=document.getElementById('workerFormError');
    if(errBanner){errBanner.style.display='none';errBanner.textContent='';}
    document.querySelectorAll('#workerForm .input-error').forEach(el=>el.classList.remove('input-error'));
  }

  const nameInput=document.getElementById('workerNameInput');
  if(nameInput){
    nameInput.addEventListener('input',()=>{
      nameInput.classList.remove('input-error');
      const errBanner=document.getElementById('workerFormError');
      if(errBanner)errBanner.style.display='none';
    });
  }

  // 10-digit mobile number filter
  const phoneInput=document.getElementById('workerPhoneInput');
  if(phoneInput){
    phoneInput.addEventListener('input',e=>{
      phoneInput.classList.remove('input-error');
      const errBanner=document.getElementById('workerFormError');
      if(errBanner)errBanner.style.display='none';
      e.target.value=e.target.value.replace(/[^0-9]/g,'').slice(0,10);
    });
  }

  // Aadhaar dynamic formatter and verification badge (Last 4 digits only)
  const aadhaarInput=document.getElementById('workerAadhaarInput');
  const aadhaarBadge=document.getElementById('aadhaarBadge');
  if(aadhaarInput){
    aadhaarInput.addEventListener('input',e=>{
      aadhaarInput.classList.remove('input-error');
      const errBanner=document.getElementById('workerFormError');
      if(errBanner)errBanner.style.display='none';
      let val=e.target.value.replace(/[^0-9]/g,'').slice(0,4);
      e.target.value=val;
      if(val.length===4){
        aadhaarBadge.style.display='inline-flex';
        aadhaarBadge.style.background='#e1f5e8';
        aadhaarBadge.style.color='#1e7e34';
        aadhaarBadge.innerHTML=`✓ ${tr('VERIFIED','सत्यापित')}`;
      } else if(val.length>0){
        aadhaarBadge.style.display='inline-flex';
        aadhaarBadge.style.background='#fff3cd';
        aadhaarBadge.style.color='#856404';
        aadhaarBadge.innerHTML=`🔒 ${val.length}/4`;
      } else {
        aadhaarBadge.style.display='none';
      }
    });
  }

  // Map & Location Handling
  const locInput=document.getElementById('workerLocInput');
  const resolvedTag=document.getElementById('pincodeResolvedTag');
  const resolvedText=document.getElementById('resolvedLocText');
  const suggestionsBox=document.getElementById('citySuggestionsDropdown');

  let mapInstance=null;
  let markerInstance=null;
  let searchTimer=null;

  function updateMapAndMarker(lat, lng, labelText){
    regCoords={lat, lng};
    if(mapInstance && markerInstance){
      markerInstance.setLatLng([lat, lng]);
      mapInstance.setView([lat, lng], 14);
      if(labelText) markerInstance.bindPopup(`<b>${labelText}</b>`).openPopup();
    }
  }

  function renderSuggestions(matches){
    if(!matches || !matches.length){
      suggestionsBox.style.display = 'none';
      return;
    }
    suggestionsBox.innerHTML = matches.map(c => `
      <div class="city-suggestion-item" data-lat="${c.lat}" data-lng="${c.lng}" data-name="${c.name}" data-district="${c.district||''}" data-state="${c.state||''}" data-pin="${c.pin||''}">
        <span>📍</span>
        <div style="flex:1">
          <b>${c.name}</b>
          ${c.type ? `<span class="city-suggestion-type">${c.type}</span>` : ''}
          <br>
          <small>${c.district ? c.district + ', ' : ''}${c.state || 'India'}${c.pin ? ' · PIN ' + c.pin : ''}</small>
        </div>
        ${c.pin ? `<small>${c.pin}</small>` : ''}
      </div>
    `).join('');
    suggestionsBox.style.display = 'block';

    suggestionsBox.querySelectorAll('.city-suggestion-item').forEach(item => {
      item.addEventListener('click', ()=>{
        const name = item.dataset.name;
        const district = item.dataset.district;
        const state = item.dataset.state;
        const pin = item.dataset.pin;
        const lat = parseFloat(item.dataset.lat);
        const lng = parseFloat(item.dataset.lng);

        locInput.value = `${name}${district && district !== name ? ', ' + district : ''}, ${state}${pin ? ' (' + pin + ')' : ''}`;
        suggestionsBox.style.display = 'none';
        resolvedTag.classList.add('active');
        resolvedText.innerHTML = `📍 <b>${name}</b>, ${district ? district + ', ' : ''}${state}${pin ? ' (PIN ' + pin + ')' : ''}`;
        updateMapAndMarker(lat, lng, `${name}`);
      });
    });
  }

  getUserLocation().then(loc=>{
    regCoords={lat:loc.lat,lng:loc.lng};
    mapInstance=initMap('regMapContainer',loc.lat,loc.lng,14);
    if(!mapInstance)return;
    markerInstance=L.marker([loc.lat,loc.lng],{draggable:true,icon:createMapIcon('#12261f','YOU')}).addTo(mapInstance);
    markerInstance.bindPopup(`<b>${tr('Drag pin to your exact spot','पिन को अपनी सही जगह पर खींचें')}</b>`).openPopup();
    markerInstance.on('dragend',ev=>{
      const pos=ev.target.getLatLng();
      regCoords={lat:pos.lat,lng:pos.lng};
    });

    const gpsBtn=document.getElementById('detectGpsBtn');
    if(gpsBtn){
      gpsBtn.addEventListener('click',()=>{
        getUserLocation().then(newLoc=>{
          updateMapAndMarker(newLoc.lat, newLoc.lng, tr('Your detected GPS position','आपकी खोजी गई GPS लोकेशन'));
          if(locInput && !locInput.value){
            locInput.value='Bengaluru (GPS Detected)';
          }
          showToast(tr('Location Updated','लोकेशन अपडेट हुई'),tr('Device GPS detected successfully.','डिवाइस GPS सफलतापूर्वक लिया गया।'));
        });
      });
    }
  });

  // Smart Location Input Listener (Pincode + Tehsil/City/District Autocomplete + Live Fallback)
  if(locInput && suggestionsBox && resolvedTag){
    locInput.addEventListener('input', e=>{
      const val = e.target.value.trim();
      const isDigitsOnly = /^[0-9]+$/.test(val);

      if(isDigitsOnly){
        // User is typing numbers (PIN Code)
        suggestionsBox.style.display = 'none';
        if(val.length >= 3){
          const resolved = resolveIndianPincode(val);
          if(resolved){
            resolvedTag.classList.add('active');
            resolvedText.innerHTML = `📍 <b>${resolved.name}</b> (${resolved.district}, ${resolved.state}) · PIN ${val}`;
            updateMapAndMarker(resolved.lat, resolved.lng, `${resolved.name} · PIN ${val}`);
          } else {
            resolvedTag.classList.remove('active');
          }
        } else {
          resolvedTag.classList.remove('active');
        }
      } else {
        // User is typing text (Tehsil, District, City, Town)
        resolvedTag.classList.remove('active');
        if(val.length >= 2){
          const localMatches = searchIndianTehsilsAndDistricts(val);
          renderSuggestions(localMatches);

          // Live geocoding query fallback
          clearTimeout(searchTimer);
          searchTimer = setTimeout(()=>{
            fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=6&q=${encodeURIComponent(val)}`)
              .then(res=>res.json())
              .then(data=>{
                if(data && data.length){
                  const liveMatches = data.map(item=>({
                    name: item.name || item.display_name.split(',')[0],
                    type: (item.type || 'Location').toUpperCase(),
                    district: (item.display_name.split(',')[1]||'').trim(),
                    state: (item.display_name.split(',')[2]||'India').trim(),
                    pin: '',
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lon)
                  }));
                  const combined = [...localMatches];
                  liveMatches.forEach(lm=>{
                    if(!combined.some(c=>Math.abs(c.lat - lm.lat)<0.04 && Math.abs(c.lng - lm.lng)<0.04)){
                      combined.push(lm);
                    }
                  });
                  renderSuggestions(combined.slice(0, 8));
                }
              })
              .catch(()=>{});
          }, 250);
        } else {
          suggestionsBox.style.display = 'none';
        }
      }
    });

    document.addEventListener('click', ev => {
      if(!locInput.contains(ev.target) && !suggestionsBox.contains(ev.target)){
        suggestionsBox.style.display = 'none';
      }
    });

    locInput.addEventListener('input', ()=>{
      locInput.classList.remove('input-error');
      const errBanner=document.getElementById('workerFormError');
      if(errBanner)errBanner.style.display='none';
    });
  }

  // Backup direct submit button listener
  const submitBtn=document.getElementById('workerSubmitBtn');
  const workerForm=document.getElementById('workerForm');
  if(submitBtn && workerForm){
    submitBtn.addEventListener('click', e => {
      e.preventDefault();
      handleFormSubmit({ preventDefault: ()=>{}, target: workerForm });
    });
  }
}



function workerTraining(){
  return `
    <div class="step">FIND A JOB / 02</div>
    <h2 id="modalTitle">${tr('Learn. Build. Level up your Rank.','सीखें। बनाएँ। अपनी रैंक बढ़ाएँ।')}</h2>
    <p>${tr('Your rank rises dynamically with fieldwork experience, completed jobs, reliability and on-site quality scores — unlocking higher daily pay.','आपकी रैंक काम के अनुभव, पूरे किए गए काम, विश्वसनीयता और गुणवत्ता स्कोर के साथ बढ़ती है — और आपको अधिक दैनिक कमाई देती है।')}</p>
    <div class="video-card">
      <div class="video-frame"><span class="video-play">▶</span></div>
      <div><b>${tr('How Nirmaan Progress Rank Works — हिन्दी / EN','निर्मान प्रोग्रेस रैंक कैसे काम करता है')}</b><small>2:14 min</small></div>
    </div>
    <div class="rank-explainer">
      <div><b>SILVER</b><small>${tr('Verified Starter','शुरुआती पेशेवर')}<br />₹900+ / day</small></div>
      <div><b>GOLD</b><small>${tr('Reliable Pro','भरोसेमंद प्रो')}<br />₹1,050+ / day</small></div>
      <div><b>DIAMOND</b><small>${tr('Trained Quality','उच्च गुणवत्ता')}<br />₹1,250+ / day</small></div>
      <div><b>VIP</b><small>${tr('Design Crew Master','डिज़ाइन मास्टर')}<br />₹1,500+ / day</small></div>
    </div>
    <button class="button button-dark full" id="goAvailable" style="justify-content:center;margin-top:16px">${tr('Complete Setup & View My Profile','पंजीकरण पूरा करें और प्रोफ़ाइल देखें')} <span>→</span></button>
  `;
}

function availableWorker(workerObj){
  const w = workerObj || currentLoggedWorker || workers[0];
  return `
    <div class="step">${tr('REGISTRATION COMPLETE · YOU ARE LIVE','पंजीकरण पूरा · आप अब लाइव हैं')}</div>
    <h2 id="modalTitle">${tr('Congratulations, ','बधाई हो, ')}${w.name.split(' ')[0]}!</h2>
    <p>${tr('Your professional profile is active. Customers nearby can now discover and hire you directly.','आपकी प्रोफ़ाइल सक्रिय है। पास के ग्राहक अब आपको खोज सकते हैं और सीधे काम दे सकते हैं।')}</p>
    <div id="workerLocMap" style="height:230px;border-radius:9px;border:1px solid #d8e1d7;margin:16px 0;position:relative;z-index:1"></div>
    <div class="nearby-callout"><b>${tr('Live Matching Active:','लाइव मैचिंग सक्रिय:')}</b> ${tr('Your profile is pinned on the customer discovery map with Diamond/Gold badge.','आपकी प्रोफ़ाइल ग्राहक खोज मैप पर रैंक बैज के साथ पिन हो गई है।')}</div>
    <button class="button button-lime full" id="openMyDashboardNow" style="justify-content:center;margin-top:14px">${tr('Open My Worker Dashboard & Jobs Feed','मेरा वर्कर डैशबोर्ड व काम देखें')} <span>→</span></button>
  `;
}

function initWorkerLocMap(workerObj){
  const w=workerObj||currentLoggedWorker||workers[0];
  const map=initMap('workerLocMap',w.lat,w.lng,15);
  if(!map)return;
  L.marker([w.lat,w.lng],{icon:createWorkerMapIcon(w)}).addTo(map).bindPopup(`<b>${w.name}</b><br>${w.role} · ${w.rating} ★`).openPopup();
  workers.forEach(otherW=>{
    if(otherW.id!==w.id){
      L.marker([otherW.lat,otherW.lng],{icon:createWorkerMapIcon(otherW)}).addTo(map).bindPopup(`<b>${otherW.name}</b><br>${otherW.role}`);
    }
  });
}

function workerDashboardHtml(w){
  const rankInfo=calculateRankData(w);
  const isAvail = w.available !== false;
  return `
    <div class="worker-dash">
      <div class="worker-dash-header">
        <div class="worker-dash-left">
          <img src="${w.image}" alt="${w.name}" />
          <div class="worker-dash-title">
            <h2>${w.name}</h2>
            <p>${workerRole(w)} · 📞 ${w.phone||'+91 98765 43210'} · 📍 ${w.distance||'Indiranagar'}</p>
            <div style="display:flex;gap:6px;margin-top:6px">
              <span style="font-size:10px;background:#e2f2e5;color:#1e7e34;padding:2px 6px;border-radius:3px;font-weight:600">✓ ${tr('Aadhaar Verified','आधार सत्यापित')}</span>
              <span style="font-size:10px;background:#e5edf6;color:#1d558b;padding:2px 6px;border-radius:3px;font-weight:600">✦ ${tr('Skill Tested','हुनर प्रमाणित')}</span>
            </div>
          </div>
        </div>
        <div>
          <button class="availability-switch ${isAvail?'':'busy'}" id="toggleAvailBtn">
            <span class="dot"></span>
            <span>${isAvail?tr('Available for Work','काम के लिए उपलब्ध'):tr('Busy / Offline','व्यस्त / ऑफलाइन')}</span>
          </button>
        </div>
      </div>

      <div class="rank-progress-card">
        <div class="rank-progress-head">
          <div class="rank-current">
            <span class="rank-tag ${rankInfo.cls}">${rankLabel(rankInfo.rank)}</span>
            <span style="font-size:13px;font-weight:600">${tr('Pro Craftsman','कुशल कारीगर')}</span>
          </div>
          <span style="font:11px var(--mono);color:#d6f35d">${rankInfo.progressPercent}% ${tr('to','से')} ${rankLabel(rankInfo.nextRank)}</span>
        </div>
        <div class="xp-bar-bg">
          <div class="xp-bar-fill" style="width:${rankInfo.progressPercent}%"></div>
        </div>
        <small style="font-size:11px;color:#cce3d5">${tr('Each completed job and 5-star rating accelerates your promotion to the next rank tier.','हर पूरा काम और 5-स्टार रेटिंग आपकी रैंक को तेजी से आगे बढ़ाती है।')}</small>
        <div class="xp-factors">
          <div>
            <b>${w.experience||'5 yrs'}</b>
            <small>${tr('Field Experience','मैदानी अनुभव')}</small>
          </div>
          <div>
            <b>${w.rating||'4.9'} ★</b>
            <small>${tr('Work Quality Rating','गुणवत्ता रेटिंग')}</small>
          </div>
          <div>
            <b id="dashJobsCount">${rankInfo.jobsCount}</b>
            <small>${tr('Completed Jobs','पूरे किए गए काम')}</small>
          </div>
        </div>
      </div>

      <div class="dash-tabs">
        <button class="dash-tab-btn active" data-tab="jobs">💼 ${tr('Nearby Jobs Feed','पास के उपलब्ध काम')}</button>
        <button class="dash-tab-btn" data-tab="reviews">⭐ ${tr('Ratings & Reviews','रेटिंग और समीक्षाएँ')}</button>
        <button class="dash-tab-btn" data-tab="mapview">🗺️ ${tr('My Work Radius Map','मेरा कार्य क्षेत्र')}</button>
      </div>

      <div id="tabContentJobs" class="tab-pane">
        <div class="job-feed-list">
          ${nearbyJobsFeed.map(job=>`
            <div class="job-feed-card">
              <div class="job-feed-info">
                <h4>${job.title}</h4>
                <p>📍 ${job.loc} · ⏱️ ${job.days}</p>
                <small>${tr('Matching trade:','हुनर मिलान:')} ${tr(job.trade,job.trade)} · ${job.dist}</small>
              </div>
              <div class="job-feed-action">
                <b>${job.rate}</b>
                <button class="job-apply-btn" data-job-id="${job.id}">${tr('Accept Job','काम स्वीकारें')} →</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="tabContentReviews" class="tab-pane" style="display:none">
        <div class="reviews-grid">
          ${(w.reviews&&w.reviews.length?w.reviews:[
            {author:'Deepak M.',rating:5,text:'Great punctuality and accurate woodwork alignment.'},
            {author:'Sumanth B.',rating:5,text:'Very disciplined worker, delivered clean finish.'}
          ]).map(r=>`
            <div class="review-item">
              <div class="review-item-top">
                <b>${r.author}</b>
                <span style="color:#e67e22">${'★'.repeat(r.rating||5)}</span>
              </div>
              <p>"${r.text}"</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="tabContentMap" class="tab-pane" style="display:none">
        <div id="dashRadiusMap" style="height:220px;border-radius:8px;border:1px solid #d8e1d7"></div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid #e5ebe1">
        <button class="text-button" id="switchWorkerBtn" style="color:#d9534f;font-size:12px">🚪 ${tr('Log out / Switch Account','लॉग आउट / खाता बदलें')}</button>
        <button class="button button-dark" data-close>${tr('Close Dashboard','डैशबोर्ड बंद करें')} ✕</button>
      </div>
    </div>
  `;
}

function initDashMap(w){
  const tabBtns=document.querySelectorAll('.dash-tab-btn');
  tabBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      tabBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const tab=btn.dataset.tab;
      document.getElementById('tabContentJobs').style.display=tab==='jobs'?'block':'none';
      document.getElementById('tabContentReviews').style.display=tab==='reviews'?'block':'none';
      const mapPane=document.getElementById('tabContentMap');
      mapPane.style.display=tab==='mapview'?'block':'none';
      if(tab==='mapview'){
        setTimeout(()=>{
          const map=initMap('dashRadiusMap',w.lat,w.lng,14);
          if(!map)return;
          L.marker([w.lat,w.lng],{icon:createWorkerMapIcon(w)}).addTo(map).bindPopup(`<b>${w.name}</b><br>${tr('Your service center','आपका कार्य केंद्र')}`).openPopup();
          L.circle([w.lat,w.lng],{radius:3500,color:'#27ae60',fillColor:'#27ae60',fillOpacity:0.15}).addTo(map);
        },100);
      }
    });
  });

  const toggleBtn=document.getElementById('toggleAvailBtn');
  if(toggleBtn){
    toggleBtn.addEventListener('click',()=>{
      w.available = w.available === false ? true : false;
      setLoggedWorker(w);
      showToast(
        w.available ? tr('Status: Available','स्थिति: उपलब्ध') : tr('Status: Busy','स्थिति: व्यस्त'),
        w.available ? tr('You are now visible to nearby customers.','अब आप पास के ग्राहकों को दिखाई दे रहे हैं।') : tr('Your profile is paused from public searches.','आपकी प्रोफ़ाइल खोजों से अस्थायी रूप से रोक दी गई है।')
      );
      openModal(workerDashboardHtml(w),()=>initDashMap(w));
    });
  }

  const applyBtns=document.querySelectorAll('.job-apply-btn');
  applyBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      btn.textContent=tr('✓ Accepted!','✓ स्वीकृत!');
      btn.classList.add('accepted');
      btn.disabled=true;
      const prevRankInfo = calculateRankData(w);
      w.jobs=(parseInt(String(w.jobs||'0').replace(/[^0-9]/g,''))+1)+' jobs';
      const newRankInfo = calculateRankData(w);
      w.rank = newRankInfo.rank;
      w.cls = newRankInfo.cls;
      setLoggedWorker(w);
      
      if(newRankInfo.rank !== prevRankInfo.rank){
        showToast(
          tr(`🎉 Rank Promoted: ${rankLabel(newRankInfo.rank)}!`,`🎉 रैंक प्रमोशन: ${rankLabel(newRankInfo.rank)}!`),
          tr(`Congratulations! Your rate and trust have increased.`,`बधाई! आपकी दर और विश्वास बढ़ गया है।`)
        );
      } else {
        showToast(tr('Job Accepted!','काम स्वीकृत!'),tr('Customer notified. Milestone escrow created.','ग्राहक को सूचित कर दिया गया है।'));
      }
      openModal(workerDashboardHtml(w),()=>initDashMap(w));
    });
  });

  const logoutBtn=document.getElementById('switchWorkerBtn');
  if(logoutBtn){
    logoutBtn.addEventListener('click',()=>{
      setLoggedWorker(null);
      closeModal();
      showToast(tr('Logged out','लॉग आउट हो गए'),tr('You can sign in anytime.','आप कभी भी साइन इन कर सकते हैं।'));
    });
  }
}

/* ── NEW MULTI-STEP SIGN-IN FLOW ─────────────────────────────── */

function loginModalHtml(){
  return `
    <div style="text-align:center;padding:8px 0 4px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#7a9a8a;margin-bottom:10px">ACCOUNT SIGN IN</div>
      <h2 id="modalTitle" style="font-size:26px;margin-bottom:8px">Welcome to Nirmaan</h2>
      <p style="font-size:14px;color:#5a7a68;margin-bottom:24px">Sign in to hire workers or find dignified work.</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">
      <button id="roleCustomer" onclick="openSignInAs('customer')" style="padding:20px 12px;border-radius:14px;border:2px solid #e0e8db;background:#f8fbf5;cursor:pointer;font-family:var(--sans);transition:all .2s" onmouseover="this.style.borderColor='#12261f';this.style.background='#eef7e6'" onmouseout="this.style.borderColor='#e0e8db';this.style.background='#f8fbf5'">
        <div style="font-size:28px;margin-bottom:8px">🏠</div>
        <div style="font-size:15px;font-weight:700;color:#12261f">I'm a Customer</div>
        <div style="font-size:11px;color:#7a9a8a;margin-top:4px">Hire skilled workers</div>
      </button>
      <button id="roleWorker" onclick="openSignInAs('worker')" style="padding:20px 12px;border-radius:14px;border:2px solid #e0e8db;background:#f8fbf5;cursor:pointer;font-family:var(--sans);transition:all .2s" onmouseover="this.style.borderColor='#12261f';this.style.background='#eef7e6'" onmouseout="this.style.borderColor='#e0e8db';this.style.background='#f8fbf5'">
        <div style="font-size:28px;margin-bottom:8px">👷</div>
        <div style="font-size:15px;font-weight:700;color:#12261f">I'm a Worker</div>
        <div style="font-size:11px;color:#7a9a8a;margin-top:4px">Find jobs & earn more</div>
      </button>
    </div>

    <div style="display:flex;align-items:center;gap:10px;margin:18px 0">
      <div style="flex:1;height:1px;background:#e0e8db"></div>
      <span style="font-size:11px;color:#9ab0a5">OR CONTINUE WITH</span>
      <div style="flex:1;height:1px;background:#e0e8db"></div>
    </div>

    <button onclick="openGoogleSignIn()" style="width:100%;padding:13px;border-radius:10px;border:1.5px solid #e0e8db;background:white;cursor:pointer;font-family:var(--sans);font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:10px;transition:box-shadow .2s" onmouseover="this.style.boxShadow='0 2px 12px #0001'" onmouseout="this.style.boxShadow='none'">
      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      Continue with Google
    </button>

    <div style="text-align:center;margin-top:16px;font-size:12px;color:#66776e">
      New to Nirmaan? <a href="#" id="switchToRegister" style="color:#1d553d;font-weight:700">Register as a worker →</a>
    </div>
  `;
}

function openSignInAs(role){
  if(role==='worker'){
    openModal(workerLoginStepHtml());
  } else {
    openModal(customerLoginStepHtml());
  }
}

function openGoogleSignIn(){
  // MVP/Demo: simulate Google sign-in by opening role selection
  openModal(`
    <div style="text-align:center;padding:12px 0">
      <div style="font-size:32px;margin-bottom:12px">🔐</div>
      <h2 id="modalTitle" style="margin-bottom:8px">Google Sign-In</h2>
      <p style="font-size:13px;color:#5a7a68;margin-bottom:20px">For demo purposes, choose your role to continue:</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <button onclick="openSignInAs('customer')" style="padding:16px;border-radius:12px;border:2px solid #e0e8db;background:#f8fbf5;cursor:pointer;font-family:var(--sans)">
          <div style="font-size:24px;margin-bottom:6px">🏠</div>
          <div style="font-size:13px;font-weight:700">Customer</div>
        </button>
        <button onclick="openSignInAs('worker')" style="padding:16px;border-radius:12px;border:2px solid #e0e8db;background:#f8fbf5;cursor:pointer;font-family:var(--sans)">
          <div style="font-size:24px;margin-bottom:6px">👷</div>
          <div style="font-size:13px;font-weight:700">Worker</div>
        </button>
      </div>
    </div>
  `);
}

function workerLoginStepHtml(){
  return `
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#7a9a8a;margin-bottom:8px">WORKER SIGN IN</div>
      <h2 id="modalTitle" style="font-size:22px;margin-bottom:6px">Enter your registered mobile</h2>
      <p style="font-size:13px;color:#5a7a68">Use the number you gave while creating your worker profile.</p>
    </div>
    <form id="workerOtpPhoneForm" style="display:flex;flex-direction:column;gap:14px">
      <div>
        <label style="font-size:11px;font-weight:700;letter-spacing:.06em;color:#7a9a8a;display:block;margin-bottom:6px">MOBILE NUMBER</label>
        <div style="display:flex;align-items:center;border:1.5px solid #d0ddd0;border-radius:10px;overflow:hidden;background:white">
          <span style="padding:0 12px;font-size:14px;font-weight:600;color:#12261f;border-right:1px solid #e0e8db">+91</span>
          <input type="tel" id="workerOtpPhone" pattern="[6-9][0-9]{9}" maxlength="10" placeholder="9876543210" required style="border:none;outline:none;padding:13px 14px;font-size:15px;font-family:var(--sans);flex:1;background:transparent"/>
        </div>
      </div>
      <button class="button button-dark full" type="submit" style="justify-content:center">Send OTP <span>→</span></button>
    </form>
    <div style="display:flex;align-items:center;gap:10px;margin:16px 0">
      <div style="flex:1;height:1px;background:#e0e8db"></div>
      <span style="font-size:11px;color:#9ab0a5">OR</span>
      <div style="flex:1;height:1px;background:#e0e8db"></div>
    </div>
    <button onclick="openGoogleSignIn()" style="width:100%;padding:12px;border-radius:10px;border:1.5px solid #e0e8db;background:white;cursor:pointer;font-family:var(--sans);font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px">
      <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      Sign in with Google
    </button>
    <div style="text-align:center;margin-top:14px">
      <button onclick="openModal(loginModalHtml())" style="background:none;border:none;font-size:12px;color:#7a9a8a;cursor:pointer">← Back</button>
    </div>
  `;
}

function workerOtpVerifyHtml(phone, workerName){
  return `
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:40px;margin-bottom:10px">📱</div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#7a9a8a;margin-bottom:8px">OTP VERIFICATION</div>
      <h2 id="modalTitle" style="font-size:22px;margin-bottom:6px">Check your SMS</h2>
      <p style="font-size:13px;color:#5a7a68">We sent a 4-digit OTP to <b>+91 ${phone}</b></p>
      ${workerName ? `<div style="margin-top:8px;padding:8px 14px;background:#eef7e6;border-radius:8px;display:inline-block;font-size:12px;color:#1d553d;font-weight:600">👷 ${workerName} — verified number</div>` : ''}
    </div>
    <form id="workerOtpVerifyForm" style="display:flex;flex-direction:column;gap:14px">
      <div>
        <label style="font-size:11px;font-weight:700;letter-spacing:.06em;color:#7a9a8a;display:block;margin-bottom:6px">ENTER 4-DIGIT OTP</label>
        <input type="tel" id="workerOtpInput" maxlength="4" placeholder="e.g. 1234" required style="width:100%;padding:15px;text-align:center;font-size:24px;letter-spacing:10px;font-family:var(--mono);border:1.5px solid #d0ddd0;border-radius:10px;outline:none;font-weight:700"/>
        <div style="text-align:center;margin-top:8px;font-size:12px;color:#7a9a8a">Demo OTP: <b style="color:#12261f">1234</b></div>
      </div>
      <button class="button button-dark full" type="submit" style="justify-content:center">Verify & Sign In <span>→</span></button>
    </form>
    <div style="text-align:center;margin-top:14px">
      <button onclick="openModal(workerLoginStepHtml())" style="background:none;border:none;font-size:12px;color:#7a9a8a;cursor:pointer">← Change number</button>
    </div>
  `;
}

function customerLoginStepHtml(){
  return `
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#7a9a8a;margin-bottom:8px">CUSTOMER SIGN IN</div>
      <h2 id="modalTitle" style="font-size:22px;margin-bottom:6px">Enter your mobile number</h2>
      <p style="font-size:13px;color:#5a7a68">We'll send you an OTP to verify your number.</p>
    </div>
    <form id="customerOtpPhoneForm" style="display:flex;flex-direction:column;gap:14px">
      <div>
        <label style="font-size:11px;font-weight:700;letter-spacing:.06em;color:#7a9a8a;display:block;margin-bottom:6px">MOBILE NUMBER</label>
        <div style="display:flex;align-items:center;border:1.5px solid #d0ddd0;border-radius:10px;overflow:hidden;background:white">
          <span style="padding:0 12px;font-size:14px;font-weight:600;color:#12261f;border-right:1px solid #e0e8db">+91</span>
          <input type="tel" id="customerOtpPhone" pattern="[6-9][0-9]{9}" maxlength="10" placeholder="9999888777" required style="border:none;outline:none;padding:13px 14px;font-size:15px;font-family:var(--sans);flex:1;background:transparent"/>
        </div>
      </div>
      <button class="button button-dark full" type="submit" style="justify-content:center">Send OTP <span>→</span></button>
    </form>
    <div style="display:flex;align-items:center;gap:10px;margin:16px 0">
      <div style="flex:1;height:1px;background:#e0e8db"></div>
      <span style="font-size:11px;color:#9ab0a5">OR</span>
      <div style="flex:1;height:1px;background:#e0e8db"></div>
    </div>
    <button onclick="openGoogleSignIn()" style="width:100%;padding:12px;border-radius:10px;border:1.5px solid #e0e8db;background:white;cursor:pointer;font-family:var(--sans);font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px">
      <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      Sign in with Google
    </button>
    <div style="text-align:center;margin-top:14px">
      <button onclick="openModal(loginModalHtml())" style="background:none;border:none;font-size:12px;color:#7a9a8a;cursor:pointer">← Back</button>
    </div>
  `;
}

function customerOtpVerifyHtml(phone){
  return `
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:40px;margin-bottom:10px">📱</div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#7a9a8a;margin-bottom:8px">OTP VERIFICATION</div>
      <h2 id="modalTitle" style="font-size:22px;margin-bottom:6px">Check your SMS</h2>
      <p style="font-size:13px;color:#5a7a68">We sent a 4-digit OTP to <b>+91 ${phone}</b></p>
    </div>
    <form id="customerOtpVerifyForm" style="display:flex;flex-direction:column;gap:14px">
      <div>
        <label style="font-size:11px;font-weight:700;letter-spacing:.06em;color:#7a9a8a;display:block;margin-bottom:6px">ENTER 4-DIGIT OTP</label>
        <input type="tel" id="customerOtpInput" maxlength="4" placeholder="e.g. 1234" required style="width:100%;padding:15px;text-align:center;font-size:24px;letter-spacing:10px;font-family:var(--mono);border:1.5px solid #d0ddd0;border-radius:10px;outline:none;font-weight:700"/>
        <div style="text-align:center;margin-top:8px;font-size:12px;color:#7a9a8a">Demo OTP: <b style="color:#12261f">1234</b></div>
      </div>
      <button class="button button-dark full" type="submit" style="justify-content:center">Verify & Continue <span>→</span></button>
    </form>
    <div style="text-align:center;margin-top:14px">
      <button onclick="openModal(customerLoginStepHtml())" style="background:none;border:none;font-size:12px;color:#7a9a8a;cursor:pointer">← Change number</button>
    </div>
  `;
}

let _pendingCustomerPhone = '';
let _pendingWorkerPhone = '';
let _pendingWorkerFound = null;
let _customerPhotoData = '';

function getLoggedCustomer(){ try{ return JSON.parse(localStorage.getItem('nirmaan_logged_customer')||'null'); }catch(e){ return null; } }
function setLoggedCustomer(cust){
  currentLoggedCustomer = cust;
  if(cust){ try{ localStorage.setItem('nirmaan_logged_customer', JSON.stringify(cust)); }catch(e){} }
  else { try{ localStorage.removeItem('nirmaan_logged_customer'); }catch(e){} }
  updateHeaderProfile();
}

function customerProfileSetupHtml(phone){
  return `
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#7a9a8a;margin-bottom:8px">COMPLETE YOUR PROFILE</div>
      <h2 id="modalTitle" style="font-size:22px;margin-bottom:6px">Set up your customer profile</h2>
      <p style="font-size:13px;color:#5a7a68">Tell us a bit about yourself so workers know who they're working for.</p>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:18px;gap:10px">
      <div id="custAvatarPreview" style="width:90px;height:90px;border-radius:50%;background:#eef3eb;border:3px dashed #c8ddd0;display:flex;align-items:center;justify-content:center;font-size:36px;overflow:hidden;cursor:pointer" onclick="document.getElementById('custPhotoInput').click()">📷</div>
      <input type="file" id="custPhotoInput" accept="image/*" style="display:none"/>
      <div style="font-size:11px;color:#9ab0a5">Profile photo (optional) — click to upload</div>
    </div>
    <form id="customerProfileForm" style="display:flex;flex-direction:column;gap:14px">
      <input type="hidden" id="custPhoneDisplay" value="${phone}"/>
      <div>
        <label style="font-size:11px;font-weight:700;letter-spacing:.06em;color:#7a9a8a;display:block;margin-bottom:6px">YOUR NAME *</label>
        <input type="text" id="custNameInput" placeholder="e.g. Rahul Sharma" required style="width:100%;padding:13px 14px;border:1.5px solid #d0ddd0;border-radius:10px;font-size:15px;font-family:var(--sans);outline:none"/>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;letter-spacing:.06em;color:#7a9a8a;display:block;margin-bottom:6px">MOBILE NUMBER</label>
        <input type="text" value="+91 ${phone}" disabled style="width:100%;padding:13px 14px;border:1.5px solid #e8ede5;border-radius:10px;font-size:15px;font-family:var(--sans);background:#f8fbf5;color:#7a9a8a"/>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;letter-spacing:.06em;color:#7a9a8a;display:block;margin-bottom:6px">CONSTRUCTION SITE / LOCATION *</label>
        <input type="text" id="custLocInput" placeholder="e.g. Indiranagar, Bengaluru" required style="width:100%;padding:13px 14px;border:1.5px solid #d0ddd0;border-radius:10px;font-size:15px;font-family:var(--sans);outline:none"/>
        <div style="font-size:11px;color:#9ab0a5;margin-top:5px">Your construction site or area where you need workers</div>
      </div>
      <button class="button button-dark full" type="submit" style="justify-content:center;margin-top:4px">Create Profile &amp; Continue <span>→</span></button>
    </form>
  `;
}

function initCustomerPhotoCapture(){
  const input = document.getElementById('custPhotoInput');
  const preview = document.getElementById('custAvatarPreview');
  if(!input || !preview) return;
  input.addEventListener('change', ()=>{
    const file = input.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      _customerPhotoData = ev.target.result;
      preview.innerHTML = `<img src="${_customerPhotoData}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>`;
    };
    reader.readAsDataURL(file);
  });
}

function showCustomerProfilePopup(){
  const c = currentLoggedCustomer;
  if(!c) return;
  // Open as a proper full modal (same style as worker registration)
  openModal(customerDashboardModalHtml(c));
}

function customerDashboardModalHtml(c){
  const hasPhoto = c && c.image && (c.image.startsWith('data:') || c.image.startsWith('http'));
  return `
    <div class="step">CUSTOMER ACCOUNT</div>
    <h2 id="modalTitle" style="margin-bottom:6px">${c ? c.name : 'My Profile'}</h2>
    <p style="font-size:13px;color:#5a7a68;margin-bottom:18px">Manage your profile and posted jobs.</p>

    <!-- Photo -->
    <div style="display:flex;align-items:center;gap:16px;background:#f4f7ef;border-radius:12px;padding:14px 16px;margin-bottom:18px">
      <div style="width:72px;height:72px;border-radius:50%;overflow:hidden;border:3px solid #d6f35d;background:#eef3eb;display:flex;align-items:center;justify-content:center;font-size:30px;flex-shrink:0">
        ${hasPhoto ? `<img src="${c.image}" style="width:100%;height:100%;object-fit:cover" alt="${c.name}"/>` : '🏠'}
      </div>
      <div>
        <div style="font-size:16px;font-weight:700;color:#12261f">${c ? c.name : '—'}</div>
        <div style="font-size:12px;color:#5a7a68;margin-top:2px">📞 +91 ${c ? c.phone : '—'}</div>
        <div style="font-size:11px;color:#5a7a68;margin-top:2px">📍 ${c ? (c.location || 'No location set') : '—'}</div>
        <div style="font-size:10px;color:#9ab0a5;margin-top:2px">Member since ${c ? (c.joinedAt || c.created_at || 'Today') : 'Today'}</div>
      </div>
    </div>

    <!-- My Posted Jobs -->
    <div style="margin-bottom:18px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#5a7a68;margin-bottom:10px">MY POSTED JOBS</div>
      <div id="customerJobsList">
        ${renderCustomerJobsInline(c)}
      </div>
      <button onclick="openModal(postJobAsCustomerHtml())" style="width:100%;margin-top:10px;padding:12px;background:#12261f;color:#d6f35d;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--sans)">+ Post a New Job →</button>
    </div>

    <!-- Actions -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <button onclick="openCustomerEditModal()" style="padding:11px;border-radius:9px;border:1.5px solid #d0ddd0;background:white;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--sans)">✏️ Edit Profile</button>
      <button onclick="logoutCustomer()" style="padding:11px;border-radius:9px;border:1.5px solid #fecaca;background:#fff5f5;color:#e74c3c;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--sans)">🚪 Sign Out</button>
    </div>
  `;
}

function renderCustomerJobsInline(c){
  const postedJobs = getCustomerPostedJobs(c ? c.id : null);
  if(!postedJobs || !postedJobs.length){
    return `<div style="text-align:center;padding:16px;background:#f8fbf5;border-radius:10px;font-size:13px;color:#7a9a8a">No jobs posted yet.<br><small>Post your first job to find skilled workers.</small></div>`;
  }
  return postedJobs.map(job => `
    <div style="background:#f8fbf5;border:1px solid #e0ebd8;border-radius:10px;padding:12px 14px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:13px;font-weight:700;color:#12261f;margin-bottom:2px">${job.title}</div>
          <div style="font-size:11px;color:#5a7a68">📍 ${job.location} · ${job.trade}</div>
        </div>
        <span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:5px;${job.status==='open'?'background:#e1f5e8;color:#1e7e34':job.status==='hired'?'background:#dbeafe;color:#1e40af':'background:#f3f4f6;color:#6b7280'}">${(job.status||'open').toUpperCase()}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
        <span style="font-size:12px;font-weight:700;font-family:var(--mono);color:#12261f">${job.rate || '₹900/day'}</span>
        ${job.status==='open' ? `<button onclick="viewJobApplicants('${job.id}')" style="font-size:11px;padding:5px 10px;border-radius:6px;background:#12261f;color:#d6f35d;border:none;cursor:pointer;font-family:var(--sans)">View Applicants →</button>` : ''}
      </div>
    </div>
  `).join('');
}

function getCustomerPostedJobs(customerId){
  if(!customerId) return [];
  try {
    const allJobs = JSON.parse(localStorage.getItem('nirmaan_customer_jobs') || '[]');
    return allJobs.filter(j => j.customer_id === customerId);
  } catch(e){ return []; }
}

function openCustomerEditModal(){
  const c = currentLoggedCustomer;
  if(!c) return;
  let editPhotoData = c.image || '';
  openModal(`
    <div class="step">EDIT CUSTOMER PROFILE</div>
    <h2 id="modalTitle">Update your details</h2>

    <!-- Photo -->
    <div style="display:flex;flex-direction:column;align-items:center;margin:16px 0 20px;gap:10px">
      <div id="custEditAvatarPreview" onclick="document.getElementById('custEditPhotoInput').click()" style="width:90px;height:90px;border-radius:50%;overflow:hidden;border:3px dashed #c8ddd0;background:#eef3eb;display:flex;align-items:center;justify-content:center;font-size:36px;cursor:pointer;position:relative">
        ${c.image && (c.image.startsWith('data:') || c.image.startsWith('http')) ? `<img src="${c.image}" style="width:100%;height:100%;object-fit:cover"/>` : '📷'}
      </div>
      <input type="file" id="custEditPhotoInput" accept="image/*" style="display:none"/>
      <div style="font-size:11px;color:#9ab0a5">Click to change photo</div>
    </div>

    <form id="customerEditForm" style="display:flex;flex-direction:column;gap:14px">
      <div>
        <label style="font-size:11px;font-weight:700;letter-spacing:.06em;color:#7a9a8a;display:block;margin-bottom:6px">YOUR NAME *</label>
        <input id="custEditName" type="text" value="${c.name}" required style="width:100%;padding:13px 14px;border:1.5px solid #d0ddd0;border-radius:10px;font-size:15px;font-family:var(--sans);outline:none"/>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;letter-spacing:.06em;color:#7a9a8a;display:block;margin-bottom:6px">CONSTRUCTION SITE LOCATION *</label>
        <input id="custEditLoc" type="text" value="${c.location||''}" placeholder="e.g. Indiranagar, Bengaluru" required style="width:100%;padding:13px 14px;border:1.5px solid #d0ddd0;border-radius:10px;font-size:15px;font-family:var(--sans);outline:none"/>
        <button type="button" id="custEditGpsBtn" style="margin-top:8px;padding:9px 14px;border:1px solid #d0ddd0;border-radius:8px;font-size:12px;cursor:pointer;font-family:var(--sans);background:white">📍 Detect GPS Location</button>
      </div>
      <button class="button button-dark full" type="submit" style="justify-content:center">Save Changes <span>→</span></button>
    </form>
  `);
  // Wire photo upload
  setTimeout(()=>{
    const inp = document.getElementById('custEditPhotoInput');
    const prev = document.getElementById('custEditAvatarPreview');
    if(inp && prev){
      inp.addEventListener('change', ()=>{
        const file = inp.files[0]; if(!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          editPhotoData = ev.target.result;
          prev.innerHTML = `<img src="${editPhotoData}" style="width:100%;height:100%;object-fit:cover"/>`;
        };
        reader.readAsDataURL(file);
      });
    }
    // GPS
    const gpsBtn = document.getElementById('custEditGpsBtn');
    if(gpsBtn){ gpsBtn.addEventListener('click', ()=>{
      getUserLocation().then(loc=>{
        const locInp = document.getElementById('custEditLoc');
        if(locInp) locInp.value = `GPS Location (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`;
      });
    }); }
    // Form submit
    const form = document.getElementById('customerEditForm');
    if(form){ form.addEventListener('submit', e=>{
      e.preventDefault();
      const name = document.getElementById('custEditName').value.trim();
      const loc = document.getElementById('custEditLoc').value.trim();
      if(!name || !loc){ showToast('Missing fields', 'Name and location are required'); return; }
      const updated = { ...currentLoggedCustomer, name, location: loc, image: editPhotoData };
      setLoggedCustomer(updated);
      closeModal();
      showToast('Profile updated ✓', 'Your profile has been saved.');
      nirmaanAPI.put(`/customers/${updated.id}`, { name, location: loc, image: editPhotoData }).catch(()=>{});
    }); }
  }, 100);
}

function postJobAsCustomerHtml(){
  const trades = ['Carpenter', 'Painter', 'Mason', 'Electrician', 'Plumber', 'General Labour'];
  return `
    <div class="step">POST A JOB</div>
    <h2 id="modalTitle">Hire a skilled worker</h2>
    <p style="font-size:13px;color:#5a7a68;margin-bottom:16px">Describe what you need — verified workers nearby will respond.</p>
    <form id="customerPostJobForm" style="display:flex;flex-direction:column;gap:14px">
      <div class="form-row">
        <div class="field">
          <label>JOB TITLE</label>
          <input id="jobTitle" type="text" placeholder="e.g. Wardrobe carpentry work" required/>
        </div>
        <div class="field">
          <label>TRADE REQUIRED</label>
          <select id="jobTrade" required>
            ${trades.map(t => `<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>DAILY RATE OFFERED</label>
          <select id="jobRate">
            <option>₹700/day</option><option>₹800/day</option><option>₹900/day</option>
            <option>₹1,000/day</option><option>₹1,100/day</option><option>₹1,200/day</option>
            <option>₹1,350/day</option><option>₹1,500/day</option>
          </select>
        </div>
        <div class="field">
          <label>DURATION</label>
          <select id="jobDays">
            <option>1 day</option><option>2 days</option><option>3 days</option>
            <option>4 days</option><option>5 days</option><option>6 days</option>
            <option>1 week</option><option>2 weeks</option><option>1 month+</option>
          </select>
        </div>
      </div>
      <div class="field full">
        <label>SITE LOCATION</label>
        <input id="jobLocation" type="text" value="${currentLoggedCustomer ? (currentLoggedCustomer.location||'') : ''}" placeholder="Construction site address" required/>
      </div>
      <div class="field full">
        <label>JOB DESCRIPTION</label>
        <textarea id="jobDesc" rows="3" placeholder="Describe the work in detail — materials provided, access, special requirements..." style="width:100%;padding:13px;border:1.5px solid #d0ddd0;border-radius:10px;font-size:14px;font-family:var(--sans);resize:vertical;outline:none"></textarea>
      </div>
      <button class="button button-dark full" type="submit" style="justify-content:center">Post Job — Find Workers Now <span>→</span></button>
    </form>
  `;
}

function viewJobApplicants(jobId){
  const jobs = JSON.parse(localStorage.getItem('nirmaan_customer_jobs') || '[]');
  const job = jobs.find(j => j.id === jobId);
  if(!job){ showToast('Not found', 'Job data not found'); return; }
  const applications = JSON.parse(localStorage.getItem('nirmaan_job_applications_' + jobId) || '[]');
  const allWorkers = [...initialWorkers, ...getCustomWorkers()];
  const applicants = applications.map(app => {
    const w = allWorkers.find(w => w.id === app.workerId);
    return w ? { ...w, appStatus: app.status } : null;
  }).filter(Boolean);

  openModal(`
    <div class="step">JOB APPLICANTS</div>
    <h2 id="modalTitle">${job.title}</h2>
    <p style="font-size:13px;color:#5a7a68;margin-bottom:16px">${applicants.length} worker${applicants.length !== 1 ? 's have' : ' has'} applied for this job.</p>
    ${applicants.length === 0 ? `
      <div style="text-align:center;padding:24px;background:#f8fbf5;border-radius:12px">
        <div style="font-size:32px;margin-bottom:8px">⏳</div>
        <div style="font-size:14px;font-weight:600;color:#5a7a68">Waiting for applications</div>
        <div style="font-size:12px;color:#9ab0a5;margin-top:4px">Workers nearby will see your job and apply.</div>
      </div>
    ` : applicants.map(w => `
      <div style="background:#f8fbf5;border:1px solid #e0ebd8;border-radius:12px;padding:14px;margin-bottom:10px;display:flex;gap:12px;align-items:center">
        <div style="width:52px;height:52px;border-radius:50%;overflow:hidden;flex-shrink:0;border:2px solid #d0ddd0">
          <img src="${w.image}" style="width:100%;height:100%;object-fit:cover" alt="${w.name}"/>
        </div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">${w.name}</div>
          <div style="font-size:12px;color:#5a7a68">${w.role || w.category} · ${w.rating} ★ · ${w.jobs || '0 jobs'}</div>
          <div style="font-size:11px;color:#9ab0a5">${w.rank} rank · ${w.experience}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:13px;font-weight:700;color:#12261f;margin-bottom:6px">${w.rate}</div>
          ${w.appStatus === 'hired' ?
            `<span style="font-size:11px;background:#e1f5e8;color:#1e7e34;padding:4px 8px;border-radius:5px;font-weight:700">✓ HIRED</span>` :
            `<button onclick="hireWorkerForJob('${jobId}','${w.id}')" style="font-size:11px;padding:7px 12px;background:#12261f;color:#d6f35d;border:none;border-radius:7px;cursor:pointer;font-weight:700;font-family:var(--sans)">Hire →</button>`
          }
        </div>
      </div>
    `).join('')}
  `);
}

function hireWorkerForJob(jobId, workerId){
  // Update job status
  const jobs = JSON.parse(localStorage.getItem('nirmaan_customer_jobs') || '[]');
  const jobIdx = jobs.findIndex(j => j.id === jobId);
  if(jobIdx > -1){
    jobs[jobIdx].status = 'hired';
    jobs[jobIdx].hired_worker_id = workerId;
    localStorage.setItem('nirmaan_customer_jobs', JSON.stringify(jobs));
  }
  // Update applications
  const apps = JSON.parse(localStorage.getItem('nirmaan_job_applications_' + jobId) || '[]');
  const updated = apps.map(a => ({ ...a, status: a.workerId === workerId ? 'hired' : 'rejected' }));
  localStorage.setItem('nirmaan_job_applications_' + jobId, JSON.stringify(updated));
  // Update worker job count
  const allCustomWorkers = getCustomWorkers();
  const wIdx = allCustomWorkers.findIndex(w => w.id === workerId);
  if(wIdx > -1){
    const jNum = parseInt(String(allCustomWorkers[wIdx].jobs||'0').replace(/\D/g,'')) + 1;
    allCustomWorkers[wIdx].jobs = jNum + ' jobs';
    allCustomWorkers[wIdx].jobs_count = jNum;
    saveCustomWorkers(allCustomWorkers);
    workers = [...initialWorkers, ...allCustomWorkers];
    if(currentLoggedWorker && currentLoggedWorker.id === workerId){
      currentLoggedWorker.jobs = jNum + ' jobs';
      setLoggedWorker(currentLoggedWorker);
    }
  }
  // API call
  nirmaanAPI.post(`/jobs/${jobId}/hire`, { workerId }).catch(()=>{});
  closeModal();
  const w = [...initialWorkers, ...getCustomWorkers()].find(w => w.id === workerId);
  showToast(`🎉 ${w ? w.name : 'Worker'} hired!`, 'They will be notified and you can contact them at their listed number.');
}

function logoutCustomer(){
  setLoggedCustomer(null);
  const popup = document.getElementById('customerProfilePopup');
  if(popup) popup.remove();
  showToast('Signed out', 'You have been signed out successfully.');
}

function workerModal(w){
  openModal(`
    <div class="worker-modal">
      <img src="${w.image}" alt="${w.name}"/>
      <div>
        <div class="step">${rankLabel(w.rank)} ${tr('PROFESSIONAL · AVAILABLE','पेशेवर · उपलब्ध')}</div>
        <h2 id="modalTitle">${w.name}</h2>
        <p>${workerRole(w)} · ${distanceLabel(w.distance)}</p>
        <div class="badges">
          <span>★ ${w.rating} ${tr('rating','रेटिंग')}</span>
          <span>${jobsLabel(w.jobs)}</span>
        </div>
      </div>
    </div>
    <div id="workerProfileMap" style="height:200px;border-radius:9px;border:1px solid #d8e1d7;margin:16px 0;position:relative;z-index:1"></div>
    <div class="nearby-callout"><b>${tr('Nearby match:','पास का मिलान:')}</b> ${distanceLabel(w.distance)}. ${tr('This professional is prioritised because they are close to your location.','यह पेशेवर आपकी जगह के पास है, इसलिए इसे पहले दिखाया गया है।')}</div>
    <div class="rate-table">
      <div><span>${tr('Daily skilled-work rate','कुशल काम की दैनिक दर')}</span><b>${currentLanguage==='hi'?w.rate.replace('/day','/दिन'):w.rate}</b></div>
      <div><span>${tr('Travel support','यात्रा सहायता')}</span><b>${currentLanguage==='hi'?w.travel.replace('travel support','यात्रा सहायता').replace('nearby zone','पास का क्षेत्र'):w.travel}</b></div>
      <div><span>${tr('Estimated first-day total','पहले दिन का अनुमानित कुल')}</span><b>${w.travel==='₹0 — nearby zone'?(currentLanguage==='hi'?w.rate.replace('/day','/दिन'):w.rate):'₹'+(parseInt(w.rate.replace(/[^0-9]/g,''))+parseInt(w.travel.replace(/[^0-9]/g,''))).toLocaleString('en-IN')}</b></div>
    </div>
    <p style="font-size:12px"><b>${tr('Specialties:','विशेषताएँ:')}</b> ${w.skills}. ${tr('Travel support goes to the professional, so choosing nearby helps everyone.','यात्रा सहायता पेशेवर को मिलती है, इसलिए पास के व्यक्ति को चुनना सबके लिए अच्छा है।')}</p>
    <button class="button button-dark full" id="requestWorker" style="justify-content:center">${tr('Hire','चुनें')} ${w.name.split(' ')[0]} <span>→</span></button>
  `,()=>{
    const map=initMap('workerProfileMap',w.lat,w.lng,15);
    if(!map)return;
    L.marker([w.lat,w.lng],{icon:createWorkerMapIcon(w)}).addTo(map).bindPopup(`<b>${w.name}</b><br>${w.role} · ${w.rating} ★`).openPopup();
    getUserLocation().then(loc=>{
      L.marker([loc.lat,loc.lng],{icon:createMapIcon('#d6f35d','⌂')}).addTo(map).bindPopup(`<b>${tr('Your location','आपकी लोकेशन')}</b>`);
      L.polyline([[loc.lat,loc.lng],[w.lat,w.lng]],{color:'#12261f',weight:2,dashArray:'6 8',opacity:0.5}).addTo(map);
      map.fitBounds([[loc.lat,loc.lng],[w.lat,w.lng]],{padding:[30,30]});
    });
  });
}

function homeModal(name){
  const img=name==='The Courtyard Home'?'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85':name==='The Green Terrace'?'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=85':'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85';
  openModal(`
    <div class="step">SPECIAL HOME / EXPLORE SPACES</div>
    <h2 id="modalTitle">${name}</h2>
    <p>Affordable architecture, documented so that a trained Diamond or VIP team can build it with care.</p>
    <div class="home-modal-hero"><img src="${img}" alt="${name}" /></div>
    <div class="space-choices">
      <button data-room="Outside"><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=75" alt="Home exterior"/><span>Outside & facade</span></button>
      <button data-room="Living room"><img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=300&q=75" alt="Living room"/><span>Living room</span></button>
      <button data-room="Kitchen"><img src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=300&q=75" alt="Kitchen"/><span>Kitchen & extras</span></button>
    </div>
    <div class="match-team">
      <div class="avatars">${workers.slice(0,3).map(w=>`<img src="${w.image}" alt=""/>`).join('')}</div>
      <div><b>Suggested Diamond + VIP design crew</b><small>3 pros · ₹3,850/day + materials estimate</small></div>
    </div>
    <button class="button button-dark" id="requestWorker" style="margin-top:15px">Get this team & estimate <span>→</span></button>
  `);
}

function handleFormSubmit(e){
  if(e && e.preventDefault) e.preventDefault();
  const formTarget = (e && e.target && e.target.id) ? e.target : document.getElementById('workerForm');
  const targetId = formTarget ? formTarget.id : 'workerForm';

  if(targetId==='workerForm'){
    const nameEl=document.getElementById('workerNameInput');
    const phoneEl=document.getElementById('workerPhoneInput');
    const tradeEl=document.getElementById('workerTradeSelect');
    const expEl=document.getElementById('workerExpSelect');
    const locEl=document.getElementById('workerLocInput');
    const aadhaarEl=document.getElementById('workerAadhaarInput');
    const errBanner=document.getElementById('workerFormError');
    const submitBtn=document.getElementById('workerSubmitBtn');

    function showError(inputEl, msg){
      if(errBanner){
        errBanner.innerHTML=`⚠️ ${msg}`;
        errBanner.style.display='flex';
      }
      if(inputEl){
        inputEl.classList.add('input-error');
        inputEl.focus();
        inputEl.scrollIntoView({behavior:'smooth',block:'center'});
      }
    }

    // Reset errors
    if(errBanner){errBanner.style.display='none';errBanner.textContent='';}
    document.querySelectorAll('#workerForm .input-error').forEach(el=>el.classList.remove('input-error'));

    const name = nameEl ? nameEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.replace(/[^0-9]/g,'').slice(0,10) : '';
    const trade = tradeEl ? tradeEl.value : 'Carpenter';
    const exp = expEl ? expEl.value : '4–8 years';
    const loc = locEl ? locEl.value.trim() : '';
    const aadhaarLast4 = aadhaarEl ? aadhaarEl.value.replace(/[^0-9]/g,'').slice(0,4) : '';

    if(!name){
      showError(nameEl, tr('Please enter your full name','कृपया अपना पूरा नाम दर्ज करें'));
      return;
    }
    if(!phone || phone.length !== 10){
      showError(phoneEl, tr('Please enter a valid 10-digit mobile number','कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें'));
      return;
    }
    if(!aadhaarLast4 || aadhaarLast4.length !== 4){
      showError(aadhaarEl, tr('Please enter the last 4 digits of your Aadhaar card','कृपया अपने आधार कार्ड के अंतिम 4 अंक दर्ज करें'));
      return;
    }

    if(submitBtn){
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳</span> ${tr('Creating Profile & Opening Dashboard...','प्रोफ़ाइल तैयार हो रही है...')}`;
    }

    const roleMap={Mason:'Masonry Pro',Carpenter:'Master Carpenter',Painter:'Finish Painter',Electrician:'Licensed Electrician',Plumber:'Plumbing Expert'};
    const rateMap={Carpenter:'₹1,000/day',Mason:'₹950/day',Painter:'₹900/day',Electrician:'₹950/day',Plumber:'₹950/day'};
    const skillsMap={Carpenter:'Custom furniture · Fitting',Mason:'Brickwork · Plastering',Painter:'Texture · Finish',Electrician:'Wiring · Panel',Plumber:'Concealed piping · Fitting'};

    const newWorker={
      id:'w_'+Date.now(),
      name:name,
      phone:phone,
      aadhaarLast4:aadhaarLast4,
      role:roleMap[trade]||'Skilled Worker',
      rank:'SILVER',
      cls:'silver',
      rating:'5.0',
      jobs:'0 jobs',
      rate:rateMap[trade]||'₹950/day',
      image:regPhotoData||'',
      distance:'0.5 km away',
      skills:skillsMap[trade]||'Quality work',
      travel:'₹0 — nearby zone',
      category:trade,
      location:loc||'Bengaluru, Karnataka',
      lat:regCoords.lat||DEFAULT_LAT,
      lng:regCoords.lng||DEFAULT_LNG,
      experience:exp,
      available:true,
      reviews:[{author:'Nirmaan Inspector',rating:5,text:'Verified skill onboarding assessment completed.'}]
    };

    try { stopCameraStream(); } catch(err){}
    try {
      const customList=getCustomWorkers();
      customList.unshift(newWorker);
      saveCustomWorkers(customList);
      workers=[...initialWorkers,...customList];
    } catch(err){}
    try { setLoggedWorker(newWorker); } catch(err){}
    try { renderWorkers(); } catch(err){}
    try { closeModal(); } catch(err){}

    // Smooth direct navigation to worker-dashboard.html
    setTimeout(()=>{
      window.location.assign('worker-dashboard.html');
    }, 50);

  } else if(targetId==='phoneLoginForm'){
    const loggedW=currentLoggedWorker||workers[0];
    setLoggedWorker(loggedW);
    closeModal();
    showToast(tr('Welcome Back!','स्वागत है!'),tr(`Logged in as ${loggedW.name}`,`${loggedW.name} के रूप में लॉगिन`));
    window.location.href='worker-dashboard.html';
  } else if(targetId==='workerOtpPhoneForm'){
    const phone = (document.getElementById('workerOtpPhone')?.value||'').replace(/\D/g,'');
    if(!phone || phone.length!==10){ alert('Please enter a valid 10-digit mobile number.'); return; }
    // Check if this phone matches a registered worker
    const allWorkers = [...initialWorkers, ...getCustomWorkers()];
    const foundWorker = allWorkers.find(w => w.phone === phone);
    _pendingWorkerPhone = phone;
    _pendingWorkerFound = foundWorker || null;
    openModal(workerOtpVerifyHtml(phone, foundWorker ? foundWorker.name : null));
    // Bind the OTP verify form
    setTimeout(()=>{
      const vf = document.getElementById('workerOtpVerifyForm');
      if(vf) vf.addEventListener('submit', handleFormSubmit);
    }, 100);
  } else if(targetId==='workerOtpVerifyForm'){
    const otp = (document.getElementById('workerOtpInput')?.value||'').trim();
    if(otp !== '1234'){ 
      const inp = document.getElementById('workerOtpInput');
      if(inp){ inp.style.borderColor='#e74c3c'; inp.style.animation='shake .3s'; }
      showToast('Wrong OTP', 'Please enter the demo OTP: 1234');
      return; 
    }
    if(_pendingWorkerFound){
      setLoggedWorker(_pendingWorkerFound);
      closeModal();
      showToast('Welcome back! 👷', `Signed in as ${_pendingWorkerFound.name}`);
      setTimeout(()=>window.location.assign('worker-dashboard.html'), 400);
    } else {
      closeModal();
      showToast('Number not found', 'Please register as a worker first, or try a different number.');
      setTimeout(()=>openModal(workerLoginStepHtml()), 500);
    }
  } else if(targetId==='customerOtpPhoneForm'){
    const phone = (document.getElementById('customerOtpPhone')?.value||'').replace(/\D/g,'');
    if(!phone || phone.length!==10){ alert('Please enter a valid 10-digit mobile number.'); return; }
    _pendingCustomerPhone = phone;
    openModal(customerOtpVerifyHtml(phone));
    setTimeout(()=>{
      const vf = document.getElementById('customerOtpVerifyForm');
      if(vf) vf.addEventListener('submit', handleFormSubmit);
    }, 100);
  } else if(targetId==='customerOtpVerifyForm'){
    const otp = (document.getElementById('customerOtpInput')?.value||'').trim();
    if(otp !== '1234'){
      const inp = document.getElementById('customerOtpInput');
      if(inp){ inp.style.borderColor='#e74c3c'; }
      showToast('Wrong OTP', 'Please enter the demo OTP: 1234');
      return;
    }
    // Check if customer already has a profile
    const existingCustomer = getLoggedCustomer();
    if(existingCustomer && existingCustomer.phone === _pendingCustomerPhone){
      setLoggedCustomer(existingCustomer);
      closeModal();
      showToast('Welcome back! 🏠', `Signed in as ${existingCustomer.name}`);
      updateHeaderProfile();
    } else {
      openModal(customerProfileSetupHtml(_pendingCustomerPhone));
      setTimeout(()=>{
        const pf = document.getElementById('customerProfileForm');
        if(pf) pf.addEventListener('submit', handleFormSubmit);
        initCustomerPhotoCapture();
      }, 100);
    }
  } else if(targetId==='customerProfileForm'){
    const nameEl = document.getElementById('custNameInput');
    const locEl = document.getElementById('custLocInput');
    const name = nameEl?.value?.trim();
    const location = locEl?.value?.trim();
    if(!name){ if(nameEl){nameEl.style.borderColor='#e74c3c';nameEl.focus();} return; }
    if(!location){ if(locEl){locEl.style.borderColor='#e74c3c';locEl.focus();} return; }
    const customerData = {
      id: 'cust_'+Date.now(),
      name,
      phone: _pendingCustomerPhone || document.getElementById('custPhoneDisplay')?.value || '',
      location,
      image: _customerPhotoData || '',
      role: 'customer',
      joinedAt: new Date().toLocaleDateString('en-IN')
    };
    setLoggedCustomer(customerData);
    closeModal();
    showToast('Profile created! 🏠', `Welcome to Nirmaan, ${name}!`);
    updateHeaderProfile();
  } else {
    closeModal();
    showToast('Matches ready','Nearby professionals are being prioritized for you.');
  }
}


function showToast(title='Request sent',message='We’re finding your best matches now.'){
  const t=document.getElementById('toast');
  t.querySelector('b').textContent=title;
  t.querySelector('small').textContent=message;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3800);
}

document.querySelectorAll('[data-open="post"]').forEach(b=>b.addEventListener('click',()=>openModal(postForm())));
document.querySelectorAll('[data-open="work"]').forEach(b=>b.addEventListener('click',()=>openModal(workerStart(),initRegMap)));
document.querySelectorAll('[data-home]').forEach(b=>b.addEventListener('click',()=>homeModal(b.dataset.home)));
document.getElementById('crewBtn')?.addEventListener('click',()=>openTeamBuilder(4));
document.getElementById('loginBtn')?.addEventListener('click',()=>openModal(loginModalHtml()));

document.addEventListener('click',e=>{
  const worker=e.target.closest('[data-worker]');
  if(worker)workerModal(workers.find(w=>w.id===worker.dataset.worker));
  if(e.target.id==='confirmCrew'||e.target.id==='requestWorker'){closeModal();showToast(tr('Request Sent','अनुरोध भेजा गया'),tr('Connecting you with the professional now.','पेशेवर से संपर्क कराया जा रहा है।'));}
  if(e.target.id==='goAvailable'){openModal(availableWorker(currentLoggedWorker),()=>initWorkerLocMap(currentLoggedWorker));}
  if(e.target.id==='openMyDashboardNow'){openModal(workerDashboardHtml(currentLoggedWorker),()=>initDashMap(currentLoggedWorker));}
  if(e.target.id==='switchToRegister'){openModal(workerStart(),initRegMap);}
  const quickLogin=e.target.closest('.quick-login-worker');
  if(quickLogin){
    const id=quickLogin.dataset.loginId;
    const w=workers.find(item=>item.id===id)||workers[0];
    setLoggedWorker(w);
    closeModal();
    showToast(tr('Signed In','लॉगिन सफल'),tr(`Welcome back, ${w.name}!`,`स्वागत है, ${w.name}!`));
  }
  if(e.target.closest('[data-room]'))showToast('Design options loaded',`${e.target.closest('[data-room]').dataset.room} styles are ready to explore.`);
});

document.addEventListener('click',e=>{
  const launch=e.target.closest('[data-team-builder]');
  if(launch){openTeamBuilder(Number(launch.dataset.teamBuilder));return;}
  const preset=e.target.closest('[data-quick-team]');
  if(preset){teamCounts={...teamPresets[Number(preset.dataset.quickTeam)]};openModal(teamBuilderHtml());return;}
  const adjust=e.target.closest('[data-team-adjust]');
  if(adjust){const id=adjust.dataset.teamAdjust;teamCounts[id]=Math.max(0,teamCounts[id]+Number(adjust.dataset.change));refreshTeamBuilder();return;}
  if(e.target.id==='createCustomCrew'){const total=teamTotal();closeModal();showToast(tr('Crew request sent', 'टीम का अनुरोध भेज दिया गया'),tr(`${total} people are being matched nearby.`,`${total} लोगों के लिए पास की टीम खोजी जा रही है।`));}
});

document.querySelector('[data-design]')?.addEventListener('click',()=>homeModal('The Nivasa Home'));
document.getElementById('guideBtn')?.addEventListener('click',()=>openModal(`<div class="step">NIRMAAN GUIDE / DEMO</div><h2 id="modalTitle">Ask Nirmaan AI</h2><p>“How do I check the counter is level?”</p><div style="background:#edf4e5;padding:17px;border-radius:8px;line-height:1.55;font-size:14px">Place a spirit level along the countertop. The bubble should sit between the two center lines. If it moves outside them, adjust the support by no more than 3mm and check again.</div><div class="badges"><span>🎧 Hindi audio available</span><span>✓ Architect-approved</span></div>`));

