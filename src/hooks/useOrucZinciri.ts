import { useState, useEffect, useCallback } from 'react';
import { ZincirHalkasi } from '../types';
import { getRamazan2026Tarihleri, tarihToString } from '../utils/ramazanTarihleri';
import { yukleOrucVerileri, kaydetOrucGunu } from '../utils/orucStorage';

/**
 * Oruç zinciri verilerini yöneten hook
 */
export function useOrucZinciri() {
  const [zincirHalkalari, setZincirHalkalari] = useState<ZincirHalkasi[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [toplamIsaretli, setToplamIsaretli] = useState(0);

  // Verileri yükle
  const verileriYukle = useCallback(async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useOrucZinciri.ts:15',message:'verileriYukle çağrıldı',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    try {
      setYukleniyor(true);
      const ramazanTarihleri = getRamazan2026Tarihleri();
      const kayitliVeriler = await yukleOrucVerileri();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useOrucZinciri.ts:19',message:'Veriler yüklendi',data:{halkaSayisi:ramazanTarihleri.length,kayitliVeriSayisi:Object.keys(kayitliVeriler).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      const bugun = new Date();
      bugun.setHours(0, 0, 0, 0);

      const halkalar: ZincirHalkasi[] = ramazanTarihleri.map((tarih, index) => {
        const tarihKopya = new Date(tarih);
        tarihKopya.setHours(0, 0, 0, 0);
        const tarihString = tarihToString(tarihKopya);
        const bugunKopya = new Date(bugun);
        bugunKopya.setHours(0, 0, 0, 0);
        
        return {
          tarih: tarihKopya,
          gunNumarasi: index + 1,
          isaretli: kayitliVeriler[tarihString] === true,
          bugunMu: tarihKopya.getTime() === bugunKopya.getTime(),
        };
      });

      setZincirHalkalari(halkalar);
      setToplamIsaretli(halkalar.filter(h => h.isaretli).length);
    } catch (error) {
      console.error('Zincir verileri yüklenirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  }, []);

  // Günü işaretle/iptal et
  const gunuIsaretle = useCallback(async (tarih: Date, isaretli: boolean) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useOrucZinciri.ts:48',message:'gunuIsaretle çağrıldı',data:{tarih:tarih.toISOString(),isaretli},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    try {
      await kaydetOrucGunu(tarih, isaretli);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useOrucZinciri.ts:51',message:'verileriYukle çağrılıyor (gunuIsaretle içinden)',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      await verileriYukle(); // Verileri yeniden yükle
    } catch (error) {
      console.error('Gün işaretlenirken hata:', error);
      throw error;
    }
  }, [verileriYukle]);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cc9fe6a4-66fd-4da1-9ddb-eb4d27168ce9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useOrucZinciri.ts:58',message:'useEffect çalıştı - verileriYukle dependency arrayde',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    verileriYukle();
  }, [verileriYukle]);

  return {
    zincirHalkalari,
    yukleniyor,
    toplamIsaretli,
    gunuIsaretle,
    yenidenYukle: verileriYukle,
  };
}


