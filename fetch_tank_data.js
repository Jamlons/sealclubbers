import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const prisma = new PrismaClient();
const API_KEY = "3b261491699b1febc9a68a1b3e6c7052";
const BASE_URL = "https://api.worldoftanks.asia/wot/encyclopedia/vehicles/";

async function fetchTankData() {
  let page = 1;
  let totalPages = 1;

  do {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          application_id: API_KEY,
          fields: "-provisions,-crew,-modules_tree,-default_profile,-next_tanks,-turrets,-radios,-engines,-suspensions,-guns",
          page_no: page,
          language: "en",
        },
      });

      const { data, meta } = response.data;
      totalPages = meta.page_total;

      const tanks = Object.values(data).map(tank => ({
        tankId: parseInt(tank.tank_id),
        name: tank.name,
        shortName: tank.short_name,
        nation: tank.nation,
        tier: tank.tier,
        type: tank.type,
        big_icon: tank.images.big_icon,
        contour_icon: tank.images.contour_icon,
        description: tank.description,
      }));

      for (const tank of tanks) {
        await prisma.tank.upsert({
          where: { tankId: tank.tankId },
          update: tank,
          create: tank,
        });
      }

      console.log(`Page ${page}/${totalPages} processed.`);
      page++;
    } catch (error) {
      console.error("Error fetching tank data:", error);
      break;
    }
  } while (page <= totalPages);

  await prisma.$disconnect();
  console.log("All tank data fetched and stored successfully!");
}

fetchTankData();