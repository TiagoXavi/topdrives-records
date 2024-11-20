import en from "./en.js";
import sk from "./sk.js";
import pl from "./pl.js";
import ru from "./ru.js";
import gr from "./gr.js";
import it from "./it.js";
import jp from "./jp.js";
import de from "./de.js";
import ua from "./ua.js";
import es from "./es.js";
import fr from "./fr.js";
import nl from "./nl.js";
import br from "./br.js";
import cn from "./cn.js";
import se from "./se.js";

export default {
  br,
  cn,
  de,
  en: {
    ...en,
    m_bestOf: "Best of",
    'm_best of': "@:m_bestOf",
    c_performance2: "PER",
    c_standard2: "STD",
    'c_all-surface2': "ALL",
    'c_off-road2': "OFF",
    c_slick2: "SLK",
    c_rq: "RQ | RQ",
    c_acel: "0-60mph | 0-60mph",
    c_mra: "MRA | MRA",
    c_ola: "OLA | OLA",
    'c_?': "?",
    'c_?Engine': "?"
  },
  es,
  fr,
  gr,
  it,
  jp,
  nl,
  pl,
  ru,
  se,
  sk,
  ua
}