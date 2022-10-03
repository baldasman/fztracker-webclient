export class SiteHoursModel {
  siteHours: {
    entitySerial: string;
    from: string;
    to: string;
    sites: {
      [key: string]: {
        name: string;
        in: boolean;
        lastMovement: string;
        days: { date: string; hours: number }[];
        lastIn: string;
        lastOut: string;
      };
    };
  };

  constructor() {}
}
