import { InstrumentData } from '../types/karawi';

export const INITIAL_INSTRUMENTS: InstrumentData[] = [
  {
    id: 'kalinong-hias',
    name: 'Kalinong Hias',
    shortName: 'Kalinong Hias',
    category: 'Kalinong',
    roleSummary: 'Pembuka & penghias melodi bernada lembut',
    tagline: 'Ornamen melodis halus pembuka pertunjukan Karawitan Jambi',
    description:
      'Kalinong Hias merupakan instrumen bilah/pencon perunggu bernada tinggi dalam ansambel Karawitan Jambi yang berfungsi memperindah jalinan melodi utama serta membuka kalimat lagu dengan variasi nada yang lembut.',
    history:
      'Dalam tradisi musik Melayu Jambi, kelompok instrumen Kalinong (keromong/kelintang perunggu) berkembang di wilayah pesisir dan pedalaman Batanghari sebagai bagian penting upacara adat, penyambutan tamu kehormatan, hingga iringan tari tradisional. Kalinong Hias ditempatkan pada posisi melodi atas untuk memberikan warna ornamental.',
    culturalFunction:
      'Berperan sebagai pembuka pertunjukan dan pemberi aksen bunga nada (ornamentasi) di atas kerangka melodi, menciptakan suasana syahdu sekaligus anggun dalam penyajian Karawitan Jambi.',
    soundCharacteristics:
      'Nada tinggi yang jernih, lembut, berdenting halus dengan resonansi perunggu yang ringan dan tidak mendominasi instrumen utama.',
    parts: [
      { name: 'Pencon Perunggu (6 buah)', function: 'Sumber bunyi utama bernada tinggi yang disusun berurutan pada ancak kayu.' },
      { name: 'Ancak / Rancakan Kayu', function: 'Rangka kayu berukir motif Jambi sebagai penopang pencon dan ruang resonansi.' },
      { name: 'Tali Penyangga (Rotan/Kain)', function: 'Menahan posisi pencon agar getaran nada tetap bebas dan jernih.' },
      { name: 'Pemukul (Stik Berlapis Kain)', function: 'Alat tabuh ringan untuk menghasilkan sentuhan nada lembut dan artikulasi cepat.' },
    ],
    basicTechniques: [
      'Pegang sepasang pemukul secara rileks menggunakan ibu jari dan telunjuk agar pantulan ringan.',
      'Ketuk tepat di puncak pencon (tombol tengah) untuk menghasilkan nada jernih dan stabil.',
      'Gunakan teknik silih berganti tangan kanan dan kiri (imbalan halus) untuk ornamentasi cepat.',
      'Kontrol dinamika agar suara hiasan tetap menyatu dan tidak menutupi Kalinong Melodi.',
    ],
    soundProfile: 'kalinong-high',
    validationStatus: 'Tervalidasi',
    validatorNote: 'Susunan nada dan fungsi ornamentasi telah sesuai kerangka pembelajaran dasar Karawitan Jambi.',
    notes: [
      { id: 'kh-1', label: '1', name: 'Nada 1 (Do Tinggi)', frequency: 523.25, keyHint: 'A', toneType: 'kettle', description: 'Nada dasar pembuka register atas.' },
      { id: 'kh-2', label: '2', name: 'Nada 2 (Re Tinggi)', frequency: 587.33, keyHint: 'S', toneType: 'kettle', description: 'Nada penghubung halus menuju nada 3.' },
      { id: 'kh-3', label: '3', name: 'Nada 3 (Mi Tinggi)', frequency: 659.25, keyHint: 'D', toneType: 'kettle', description: 'Nada sentral untuk variasi hiasan melodi.' },
      { id: 'kh-5', label: '5', name: 'Nada 5 (Sol Tinggi)', frequency: 783.99, keyHint: 'F', toneType: 'kettle', description: 'Nada penguat aksen ornamental.' },
      { id: 'kh-6', label: '6', name: 'Nada 6 (La Tinggi)', frequency: 880.0, keyHint: 'G', toneType: 'kettle', description: 'Nada klimaks ringan pada akhir frase.' },
      { id: 'kh-i', label: 'i', name: 'Nada i (Do Oktaf)', frequency: 1046.5, keyHint: 'H', toneType: 'kettle', description: 'Nada tertinggi untuk kilau penutup.' },
    ],
  },
  {
    id: 'kalinong-melodi',
    name: 'Kalinong Melodi',
    shortName: 'Kalinong Melodi',
    category: 'Kalinong',
    roleSummary: 'Pembawa melodi utama lagu Karawitan Jambi',
    tagline: 'Pusat alur melodi dan identitas lagu dalam ansambel',
    description:
      'Kalinong Melodi adalah instrumen inti pembawa lagu pokok dalam Karawitan Jambi. Susunan pencon perunggunya mencakup wilayah nada utama sehingga mampu menyuarakan tema melodi secara utuh dan jelas.',
    history:
      'Sebagai tulang punggung melodi pada ansambel kelintang/kalinong Jambi, instrumen ini menjadi acuan utama para pemain lain dalam mengenali struktur lagu adat seperti lagu penyambutan, iringan tari Sekapur Sirih, dan repertoar daerah Batanghari.',
    culturalFunction:
      'Menyajikan tema lagu utama, menuntun perpindahan bagian lagu (intro, isi, dan penutup), serta menjadi patokan laras bagi seluruh instrumen melodis lainnya.',
    soundCharacteristics:
      'Suara perunggu yang bulat, terang, stabil pada register menengah, dengan sustain sedang sehingga setiap pergantian nada terdengar tegas.',
    parts: [
      { name: 'Pencon Melodi (8 buah)', function: 'Menyediakan rentang nada lengkap untuk memainkan lagu pokok.' },
      { name: 'Rancakan Kayu Ukir', function: 'Kotak resonansi berukiran khas Melayu Jambi yang memperkuat proyeksi suara.' },
      { name: 'Bantalan Tali', function: 'Menjaga jarak pencon agar tidak bersentuhan saat ditabuh.' },
      { name: 'Sepasang Pemukul Sedang', function: 'Menghasilkan artikulasi nada melodi yang jelas dan terukur.' },
    ],
    basicTechniques: [
      'Duduk tegak menghadap bagian tengah rancakan agar jangkauan tangan kanan dan kiri seimbang.',
      'Tangan kanan dominan membawa alur melodi atas, sementara tangan kiri membantu nada bawah.',
      'Terapkan teknik redam halus (menahan ujung pencon sebentar) bila diperlukan artikulasi staccato.',
      'Ikuti ketukan dasar dari Gendang Melayu dan Kalinong Jalan secara konsisten.',
    ],
    soundProfile: 'kalinong-mid',
    validationStatus: 'Tervalidasi',
    validatorNote: 'Menjadi acuan utama partitur lagu-lagu daerah Jambi pada modul pembelajaran.',
    notes: [
      { id: 'km-1', label: '1', name: 'Nada 1 (Do)', frequency: 261.63, keyHint: 'A', toneType: 'kettle', description: 'Nada dasar rendah Kalinong Melodi.' },
      { id: 'km-2', label: '2', name: 'Nada 2 (Re)', frequency: 293.66, keyHint: 'S', toneType: 'kettle', description: 'Nada langkah kedua dalam tangga nada.' },
      { id: 'km-3', label: '3', name: 'Nada 3 (Mi)', frequency: 329.63, keyHint: 'D', toneType: 'kettle', description: 'Nada karakter khas melodi Melayu Jambi.' },
      { id: 'km-4', label: '4', name: 'Nada 4 (Fa)', frequency: 349.23, keyHint: 'F', toneType: 'kettle', description: 'Nada sisipan peralihan kalimat lagu.' },
      { id: 'km-5', label: '5', name: 'Nada 5 (Sol)', frequency: 392.0, keyHint: 'G', toneType: 'kettle', description: 'Nada dominan penopang frase.' },
      { id: 'km-6', label: '6', name: 'Nada 6 (La)', frequency: 440.0, keyHint: 'H', toneType: 'kettle', description: 'Nada ekspresif penguat emosi lagu.' },
      { id: 'km-7', label: '7', name: 'Nada 7 (Si)', frequency: 493.88, keyHint: 'J', toneType: 'kettle', description: 'Nada pengantar menuju oktaf tinggi.' },
      { id: 'km-i', label: 'i', name: 'Nada i (Do Tinggi)', frequency: 523.25, keyHint: 'K', toneType: 'kettle', description: 'Nada oktaf atas penegas puncak melodi.' },
    ],
  },
  {
    id: 'kalinong-jalan',
    name: 'Kalinong Jalan',
    shortName: 'Kalinong Jalan',
    category: 'Kalinong',
    roleSummary: 'Pengatur alur ritmis dan jalinan ketukan melodi',
    tagline: 'Penggerak denyut musik yang menjaga alur permainan tetap hidup',
    description:
      'Kalinong Jalan berfungsi mengisi ruang di antara ketukan utama melalui pola ostinato dan jalinan ritmis-melodis yang berkesinambungan, sehingga musik Karawitan terasa mengalir ("berjalan").',
    history:
      'Dalam praktik ansambel tradisional Jambi, kesatuan tempo tidak hanya dijaga gendang, tetapi juga diperkuat oleh pola berulang pada Kalinong Jalan. Pola ini memudahkan penari dan pemain lain membaca pergerakan birama.',
    culturalFunction:
      'Menghubungkan unsur melodi dan ritme, menciptakan dorongan gerak yang teratur untuk mengiringi tari tradisi maupun penyajian karawitan mandiri.',
    soundCharacteristics:
      'Nada menengah-rendah yang mantap, artikulasi ritmis tegas, dan karakter denting yang teratur.',
    parts: [
      { name: 'Pencon Perunggu (5 buah)', function: 'Nada-nada inti untuk pola pengiring berulang.' },
      { name: 'Rangka Kayu Rendah', function: 'Struktur kokoh untuk menopang permainan ritmis berulang.' },
      { name: 'Tali Pengikat Ganda', function: 'Menahan kestabilan pencon pada tempo sedang hingga cepat.' },
      { name: 'Pemukul Kayu Berlapis', function: 'Memberi serangan nada yang rapi dan konsisten.' },
    ],
    basicTechniques: [
      'Jaga kestabilan jarak antar ketukan (pulsasi tetap) sebelum menambah variasi.',
      'Latih pola bergantian kanan-kiri (K-L-K-L) secara merata pada tempo lambat 72 BPM.',
      'Dengarkan aksen Gendang Melayu agar pola jalan tetap terkunci pada birama.',
    ],
    soundProfile: 'kalinong-mid',
    validationStatus: 'Menunggu Validasi',
    validatorNote: 'Menunggu konfirmasi detail variasi pola lokal dari praktisi Karawitan Jambi.',
    notes: [
      { id: 'kj-1', label: '1', name: 'Nada 1 (Dasar)', frequency: 220.0, keyHint: 'A', toneType: 'kettle', description: 'Nada pijakan ketukan pertama.' },
      { id: 'kj-2', label: '2', name: 'Nada 2 (Alur)', frequency: 246.94, keyHint: 'S', toneType: 'kettle', description: 'Nada gerak lanjutan.' },
      { id: 'kj-3', label: '3', name: 'Nada 3 (Tengah)', frequency: 293.66, keyHint: 'D', toneType: 'kettle', description: 'Nada pengisi ketukan lemah.' },
      { id: 'kj-5', label: '5', name: 'Nada 5 (Penguat)', frequency: 329.63, keyHint: 'F', toneType: 'kettle', description: 'Nada aksen jalinan ritmis.' },
      { id: 'kj-6', label: '6', name: 'Nada 6 (Balik)', frequency: 392.0, keyHint: 'G', toneType: 'kettle', description: 'Nada pembalik siklus pola.' },
    ],
  },
  {
    id: 'kalinong-penegas',
    name: 'Kalinong Penegas',
    shortName: 'Kalinong Penegas',
    category: 'Kalinong',
    roleSummary: 'Penegas aksen ketukan dan batas struktur frase',
    tagline: 'Fondasi aksen melodis yang memperjelas kerangka lagu',
    description:
      'Kalinong Penegas memiliki ukuran pencon yang lebih besar dibandingkan Kalinong Hias dan Melodi. Instrumen ini dimainkan pada titik-titik ketukan penting untuk menegaskan struktur kalimat musik.',
    history:
      'Keberadaan pencon berregister lebih rendah dalam ansambel Melayu Jambi berfungsi sebagai jembatan akustik antara kelompok kalinong melodi dengan kelompok gong dan tetawak.',
    culturalFunction:
      'Memberikan ketegasan pada jatuhnya ketukan berat, memperkokoh harmoni ansambel, dan membantu transisi antar bagian lagu.',
    soundCharacteristics:
      'Suara perunggu hangat, dalam, berwibawa, dengan resonansi lebih panjang dibanding Kalinong Hias.',
    parts: [
      { name: 'Pencon Besar (4 buah)', function: 'Menghasilkan nada rendah-menengah yang tegas dan penuh.' },
      { name: 'Ancak Kayu Tebal', function: 'Menopang bobot pencon besar sekaligus memperkuat gema rendah.' },
      { name: 'Pemukul Berbantalan Tebal', function: 'Menghasilkan serangan suara bulat tanpa bunyi logam kasar.' },
    ],
    basicTechniques: [
      'Tabuh dengan ayunan pergelangan tangan yang mantap dan terkendali.',
      'Biarkan resonansi pencon bergetar penuh agar fungsi penegasan terasa utuh.',
      'Fokus pada ketukan berat (ketukan 1 dan 3 atau akhir frase 4 ketuk).',
    ],
    soundProfile: 'kalinong-low',
    validationStatus: 'Tervalidasi',
    validatorNote: 'Fungsi musikal sebagai penegas struktur ketukan telah dikonfirmasi.',
    notes: [
      { id: 'kp-1', label: '1', name: 'Penegas 1 (Rendah)', frequency: 164.81, keyHint: 'A', toneType: 'kettle', description: 'Nada penegas dasar pembuka bar.' },
      { id: 'kp-3', label: '3', name: 'Penegas 3 (Tengah)', frequency: 196.0, keyHint: 'S', toneType: 'kettle', description: 'Nada penegas tengah kalimat.' },
      { id: 'kp-5', label: '5', name: 'Penegas 5 (Dominan)', frequency: 220.0, keyHint: 'D', toneType: 'kettle', description: 'Nada penegas transisi menuju gong.' },
      { id: 'kp-6', label: '6', name: 'Penegas 6 (Aksen)', frequency: 261.63, keyHint: 'F', toneType: 'kettle', description: 'Nada aksen penutup frase.' },
    ],
  },
  {
    id: 'gong',
    name: 'Gong',
    shortName: 'Gong',
    category: 'Perkusi Logam',
    roleSummary: 'Penanda akhir siklus gongan & pemberi wibawa akustik',
    tagline: 'Gema perunggu agung penutup setiap siklus kalimat musik',
    description:
      'Gong merupakan instrumen logam besar yang digantung pada tiang penyangga (gawangan). Dalam Karawitan Jambi, Gong menjadi penanda paling sakral dan jelas atas berakhirnya satu siklus lagu (gongan).',
    history:
      'Gong telah menjadi bagian tidak terpisahkan dari tradisi istana Melayu dan masyarakat adat Jambi sejak masa lampau, digunakan dalam perhelatan adat, penobatan, serta pengiring tari klasik Jambi.',
    culturalFunction:
      'Menandai akhir siklus birama besar, memberi ruang pernapasan musikal, dan menghadirkan kesan agung serta sakral pada pertunjukan.',
    soundCharacteristics:
      'Suara sangat rendah, berat, bergema panjang dengan gelombang getar khas (ombak) yang memenuhi ruang pertunjukan.',
    parts: [
      { name: 'Pencon (Pusat Gong)', function: 'Titik pukul utama yang menghasilkan nada rendah paling dalam dan stabil.' },
      { name: 'Bahu & Pinggir (Rim)', function: 'Area pinggir gong yang menghasilkan warna logam lebih terang untuk variasi.' },
      { name: 'Gawangan / Tiang Gantung', function: 'Rangka kayu berukir tempat gong digantung dengan tali kuat.' },
      { name: 'Tabuh Gong Berlapis Kain Tebal', function: 'Pemukul bulat empuk agar getaran rendah muncul sempurna.' },
    ],
    basicTechniques: [
      'Pukul tepat di bagian tengah pencon dengan gerakan mendorong lembut, lalu segera tarik kembali tabuh.',
      'Jangan menekan tabuh terlalu lama pada pencon agar gema tidak teredam.',
      'Posisikan tubuh sedikit menyamping dari gawangan untuk keseimbangan ayunan.',
    ],
    soundProfile: 'gong-deep',
    validationStatus: 'Tervalidasi',
    validatorNote: 'Teknik pukul pencon dan peran kolotomik telah sesuai standar pengajaran.',
    notes: [
      { id: 'gg-boss', label: 'G', name: 'Pencon Gong (Penuh)', frequency: 82.41, keyHint: 'A', toneType: 'gong-boss', description: 'Pukulan utama tengah pencon dengan gema panjang.' },
      { id: 'gg-soft', label: 'g', name: 'Pencon Lembut', frequency: 87.31, keyHint: 'S', toneType: 'gong-boss', description: 'Pukulan lembut untuk dinamika syahdu.' },
      { id: 'gg-rim', label: 'R', name: 'Pinggir Gong (Rim)', frequency: 196.0, keyHint: 'D', toneType: 'gong-rim', description: 'Aksen pinggir logam untuk efek transisi.' },
    ],
  },
  {
    id: 'gendang-melayu',
    name: 'Gendang Melayu',
    shortName: 'Gendang Melayu',
    category: 'Gendang',
    roleSummary: 'Pengendali tempo, dinamika, dan transisi lagu Melayu Jambi',
    tagline: 'Jantung ritme yang memandu tempo dan semangat pertunjukan',
    description:
      'Gendang Melayu adalah gendang dua sisi khas tradisi Melayu Jambi yang dimainkan dengan kedua telapak tangan. Instrumen ini memimpin tempo, mengatur cepat-lambat lagu, serta memberi tanda perubahan gerak tari.',
    history:
      'Berakar kuat dalam kebudayaan Melayu di sepanjang Sungai Batanghari, Gendang Melayu selalu hadir dalam musik zapin, joget, tari adat, dan ansambel Karawitan Jambi sebagai pemimpin ritme.',
    culturalFunction:
      'Memimpin jalannya tempo (irama), memberi aba-aba mulai dan berhenti, serta menciptakan dinamika riang maupun khidmat dalam sajian musik.',
    soundCharacteristics:
      'Kombinasi kontras antara bunyi rendah menggema ("Dung") pada sisi besar dan bunyi nyaring tajam ("Tak" / "Pak") pada sisi kecil.',
    parts: [
      { name: 'Baluh / Tabung Kayu', function: 'Badan gendang dari kayu pilihan (nangka/meranti) sebagai ruang resonansi.' },
      { name: 'Membran Besar (Kiri)', function: 'Kulit kambing/sapi sisi lebar penghasil bunyi rendah "Dung".' },
      { name: 'Membran Kecil (Kanan)', function: 'Kulit sisi lebih sempit penghasil bunyi tinggi "Tak" dan "Pak".' },
      { name: 'Tali Rotan / Penegang', function: 'Mengatur ketegangan kulit untuk menyetem tinggi-rendah suara.' },
    ],
    basicTechniques: [
      'Pukulan "Dung": pukul membran besar dengan telapak dan jari terbuka lalu segera lepas agar bergema.',
      'Pukulan "Tak": pukul bagian tepi membran kecil dengan ujung jari secara cepat dan ringan.',
      'Pukulan "Pak": tepuk agak ke tengah membran kecil sambil ditahan sesaat untuk menghasilkan aksen kering.',
      'Jaga keseimbangan pola dasar Melayu (contoh: Dung - Tak - Dung - Dung - Tak).',
    ],
    soundProfile: 'gendang-melayu',
    validationStatus: 'Tervalidasi',
    validatorNote: 'Notasi bunyi Dung, Tak, dan Pak telah sesuai praktik pedagogi lokal.',
    notes: [
      { id: 'gm-dung', label: 'D', name: 'Dung (Rendah Terbuka)', frequency: 98.0, keyHint: 'A', toneType: 'drum-low', description: 'Pukulan terbuka pada sisi membran besar.' },
      { id: 'gm-tak', label: 'T', name: 'Tak (Tinggi Jernih)', frequency: 245.0, keyHint: 'S', toneType: 'drum-high', description: 'Pukulan tepi cepat pada sisi membran kecil.' },
      { id: 'gm-pak', label: 'P', name: 'Pak (Aksen Redam)', frequency: 310.0, keyHint: 'D', toneType: 'drum-slap', description: 'Pukulan redam tegas sebagai penanda transisi.' },
    ],
  },
  {
    id: 'gendang-sike',
    name: 'Gendang Sike',
    shortName: 'Gendang Sike',
    category: 'Gendang',
    roleSummary: 'Pengiring ritmis tradisional Sike & jalinan perkusi Jambi',
    tagline: 'Denyut perkusi khas tradisi Sike yang energik dan menyatu',
    description:
      'Gendang Sike adalah alat musik perkusi membran tradisional Jambi yang berperan penting dalam kesenian Sike dan penguatan lapisan ritmis pada penyajian Karawitan Jambi.',
    history:
      'Kesenian Sike (Sike Rebana / tradisi vokal-perkusi bernuansa Melayu-Islam di Jambi) melahirkan karakter permainan gendang yang rapat, saling bersahutan, dan penuh kekompakan komunal.',
    culturalFunction:
      'Membangun energi kebersamaan melalui pola pukulan saling sahut (interlocking) serta memperkaya tekstur ritmis di samping Gendang Melayu.',
    soundCharacteristics:
      'Bunyi membran yang hangat, padat, responsif pada pukulan cepat, dengan perbedaan jelas antara "Bum" (tengah), "Ting" (tepi), dan "Tek" (redam).',
    parts: [
      { name: 'Bingkai / Tabung Kayu', function: 'Rangka kayu melingkar yang kokoh dan ergonomis saat dipangku.' },
      { name: 'Kulit Membran', function: 'Bidang tabuh utama yang menghasilkan variasi warna bunyi.' },
      { name: 'Pasak / Pengikat Kulit', function: 'Menjaga kestabilan tegangan kulit selama permainan berlangsung.' },
    ],
    basicTechniques: [
      'Posisikan gendang mantap di pangkuan agar tangan bebas bergerak lincah.',
      'Gunakan pukulan "Bum" di area tengah untuk pondasi ketukan berat.',
      'Kombinasikan "Ting" dan "Tek" di area tepi untuk pola sahut-sahutan yang rapi.',
    ],
    soundProfile: 'gendang-sike',
    validationStatus: 'Menunggu Validasi',
    validatorNote: 'Menunggu validasi rekaman referensi pola Sike langsung dari narasumber daerah.',
    notes: [
      { id: 'gs-bum', label: 'B', name: 'Bum (Tengah Dalam)', frequency: 112.0, keyHint: 'A', toneType: 'drum-low', description: 'Pukulan terbuka di tengah membran.' },
      { id: 'gs-ting', label: 'Ti', name: 'Ting (Tepi Nyaring)', frequency: 280.0, keyHint: 'S', toneType: 'drum-high', description: 'Pukulan ujung jari di tepi kulit.' },
      { id: 'gs-tek', label: 'Te', name: 'Tek (Redam Cepat)', frequency: 340.0, keyHint: 'D', toneType: 'drum-slap', description: 'Pukulan pendek tertahan untuk variasi ritme.' },
    ],
  },
  {
    id: 'tetawak',
    name: 'Tetawak',
    shortName: 'Tetawak',
    category: 'Perkusi Logam',
    roleSummary: 'Penanda pertengahan kalimat musik & jembatan menuju Gong',
    tagline: 'Resonansi logam tegas penyeimbang struktur gongan',
    description:
      'Tetawak (tawak-tawak) adalah gong berukuran sedang bertepi tebal khas rumpun Melayu Jambi. Instrumen ini berpasangan peran dengan Gong untuk membagi kalimat musik secara simetris.',
    history:
      'Tetawak dikenal luas di wilayah Melayu Sumatra termasuk Jambi, baik sebagai alat komunikasi adat di masa lampau maupun sebagai instrumen kolotomik penting dalam ensambel Karawitan dan iringan tari.',
    culturalFunction:
      'Menandai pembagian tengah kalimat musik sebelum jatuhnya Gong besar, menjaga keseimbangan struktur ruang waktu dalam komposisi.',
    soundCharacteristics:
      'Nada menengah-rendah yang padat, lebih tinggi dan ringkas dibanding Gong besar, dengan dengung logam khas yang jelas.',
    parts: [
      { name: 'Pencon Tetawak', function: 'Tonjolan tengah tempat pemukulan utama menghasilkan nada padat.' },
      { name: 'Dinding / Tepi Tebal', function: 'Memberikan karakter fokus suara yang lebih ringkas dari gong besar.' },
      { name: 'Tali Gantung & Gawangan', function: 'Menjaga Tetawak tergantung bebas agar resonansi optimal.' },
      { name: 'Pemukul Berbantalan Sedang', function: 'Menghasilkan aksen tegas namun tetap bulat.' },
    ],
    basicTechniques: [
      'Pukul pencon Tetawak dengan ayunan mantap pada ketukan penanda tengah frase.',
      'Selaraskan volume dengan Gong agar dialog bunyi antara Tetawak dan Gong terdengar seimbang.',
      'Gunakan teknik pukul pinggir ringan hanya untuk latihan atau aba-aba tertentu.',
    ],
    soundProfile: 'tetawak-mid',
    validationStatus: 'Tervalidasi',
    validatorNote: 'Peran kolotomik dan karakter resonansi telah terverifikasi.',
    notes: [
      { id: 'tw-boss', label: 'W', name: 'Pencon Tetawak (Utama)', frequency: 130.81, keyHint: 'A', toneType: 'gong-boss', description: 'Pukulan utama tengah pencon Tetawak.' },
      { id: 'tw-high', label: 'w', name: 'Tetawak Tinggi (Pasangan)', frequency: 146.83, keyHint: 'S', toneType: 'gong-boss', description: 'Nada pasangan lebih tinggi untuk pola bergantian.' },
      { id: 'tw-rim', label: 'R', name: 'Tepi Tetawak', frequency: 261.63, keyHint: 'D', toneType: 'gong-rim', description: 'Ketukan tepi logam untuk penanda tempo.' },
    ],
  },
];
