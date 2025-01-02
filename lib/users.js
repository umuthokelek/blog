const users = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    bio: "Yapay zeka ve makine öğrenimi konularında uzman yazılım mühendisi.",
    avatar: "https://picsum.photos/seed/user1/200",
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/ahmetyilmaz" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/ahmetyilmaz" },
      { platform: "GitHub", url: "https://github.com/ahmetyilmaz" }
    ]
  },
  {
    id: 2,
    name: "Zeynep Kaya",
    bio: "Frontend geliştirici ve web teknolojileri uzmanı.",
    avatar: "https://picsum.photos/seed/user2/200",
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/zeynepkaya" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/zeynepkaya" }
    ]
  },
  {
    id: 3,
    name: "Mehmet Demir",
    bio: "Mobil uygulama geliştirici ve React Native uzmanı.",
    avatar: "https://picsum.photos/seed/user3/200",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/mehmetdemir" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/mehmetdemir" }
    ]
  },
  {
    id: 4,
    name: "Can Yıldız",
    bio: "Blockchain teknolojileri ve Web3 geliştirici.",
    avatar: "https://picsum.photos/seed/user4/200",
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/canyildiz" },
      { platform: "GitHub", url: "https://github.com/canyildiz" }
    ]
  },
  {
    id: 5,
    name: "Ayşe Yılmaz",
    bio: "Siber güvenlik uzmanı ve güvenlik araştırmacısı.",
    avatar: "https://picsum.photos/seed/user5/200",
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/ayseyilmaz" },
      { platform: "Twitter", url: "https://twitter.com/ayseyilmaz" }
    ]
  },
  {
    id: 6,
    name: "Emre Kaya",
    bio: "Cloud mimarisi ve DevOps uzmanı.",
    avatar: "https://picsum.photos/seed/user6/200",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/emrekaya" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/emrekaya" }
    ]
  },
  {
    id: 7,
    name: "Deniz Yıldırım",
    bio: "Veri bilimci ve makine öğrenmesi uzmanı.",
    avatar: "https://picsum.photos/seed/user7/200",
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/denizyildirim" },
      { platform: "GitHub", url: "https://github.com/denizyildirim" }
    ]
  },
  {
    id: 8,
    name: "Ali Yılmaz",
    bio: "IoT sistemleri ve gömülü yazılım uzmanı.",
    avatar: "https://picsum.photos/seed/user8/200",
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/aliyilmaz" },
      { platform: "GitHub", url: "https://github.com/aliyilmaz" }
    ]
  },
  {
    id: 9,
    name: "Selin Demir",
    bio: "UI/UX tasarımcısı ve kullanıcı deneyimi uzmanı.",
    avatar: "https://picsum.photos/seed/user9/200",
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/selindemir" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/selindemir" }
    ]
  },
  {
    id: 10,
    name: "Burak Kaya",
    bio: "DevOps mühendisi ve sistem mimarı.",
    avatar: "https://picsum.photos/seed/user10/200",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/burakkaya" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/burakkaya" }
    ]
  }
];

export function getUser(id) {
  if (id) {
    return users.find(user => user.id === parseInt(id)) || null;
  }
  return users;
} 