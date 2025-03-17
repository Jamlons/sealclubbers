import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const prisma = new PrismaClient();
const API_KEY = process.env.WOT_APPLICATION_ID_ASIA;
const BASE_URL = "https://api.worldoftanks.asia/wot/encyclopedia/vehicles/";
const EXP_WN8_VALUE = "https://static.modxvm.com/wn8-data-exp/json/wg/wn8exp.json"

async function fetchTankData() {
    let page = 1;
    let totalPages = 1;
    
    let wn8Data = {};

    try {
      const wn8Response = await axios.get(EXP_WN8_VALUE);
      wn8Response.data.data.forEach(item => {
        wn8Data[item.IDNum] = {
          expDef: item.expDef,
          expFrag: item.expFrag,
          expSpot: item.expSpot,
          expDamage: item.expDamage,
          expWinRate: item.expWinRate,
        };
      });
    } catch (error) {
      console.error("Error fetching WN8 data:", error);
    }
  
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
  
        const tanks = Object.values(data).map(tank => {
          const wn8 = wn8Data[tank.tank_id] || {
            expDef: 0,
            expFrag: 0,
            expSpot: 0,
            expDamage: 0,
            expWinRate: 0
          };
  
          return {
            tankId: parseInt(tank.tank_id),
            name: tank.name,
            shortName: tank.short_name,
            nation: tank.nation,
            tier: tank.tier,
            type: tank.type,
            big_icon: tank.images.big_icon,
            contour_icon: tank.images.contour_icon,
            description: tank.description,
            expDef: wn8.expDef,
            expFrag: wn8.expFrag,
            expSpot: wn8.expSpot,
            expDamage: wn8.expDamage,
            expWinRate: wn8.expWinRate
          };
        });
  
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