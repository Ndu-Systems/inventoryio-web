export interface OurModuleModel {
Key: string;
BannerImage: string;
BannerHeader: string;
BannerText: string;
Bullets: Bullet[];
Mockups: Mockup[];
}

export interface Bullet {
  point: string;
}

export interface Mockup {
  main: string;
  text: string;
  img: string;
}
