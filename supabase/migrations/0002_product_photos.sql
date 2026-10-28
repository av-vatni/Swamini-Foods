-- Product photos from the shared Google Drive folder (matched by file name).
-- Run in Supabase Dashboard → SQL Editor. Safe to re-run.
update public.products p
set image_url = v.link
from (values
  ('anarse-pith', 'https://drive.google.com/file/d/1GYBAsGvZya6mazteZiKhD2BvyrbRV9jw/view?usp=sharing'),
  ('balushahi', 'https://drive.google.com/file/d/1UsaWeBQKrTN7jENVZnUdDc_r3YDsZ2F_/view?usp=sharing'),
  ('besan-ladoo', 'https://drive.google.com/file/d/1YLbtGqunVzbApJyYTH4ldMZnn92mhmyR/view?usp=sharing'),
  ('bhajani-chakli', 'https://drive.google.com/file/d/1-X1MvIH1VHGpBP7tw8q8begY7wGC-rqx/view?usp=sharing'),
  ('chakli-bhajani-pith', 'https://drive.google.com/file/d/1glvyyJ1nDSMcAWx768vp2PUyDsDkKn28/view?usp=sharing'),
  ('lasun-sev', 'https://drive.google.com/file/d/1cslwqWi2DHKxCfLF6-CyYhny2usatZ7P/view?usp=sharing'),
  ('karanji', 'https://drive.google.com/file/d/1099dm4_GgKJSlEnro7L1yly7fy4nn6j_/view?usp=sharing'),
  ('poha-chivda-fried', 'https://drive.google.com/file/d/1bokk5M2iESz1LZtWFOI4p5acoNe_H6pP/view?usp=sharing'),
  ('sapit-ladoo', 'https://drive.google.com/file/d/1hA_4HV_0ZEt2AMCC0UOE3HyJO4Gbs2Xi/view?usp=sharing'),
  ('sev', 'https://drive.google.com/file/d/1C13uFL-qGScXZZFFEgmx4nbI6NN672pX/view?usp=sharing'),
  ('shankarpale-salted', 'https://drive.google.com/file/d/155cyqpenjxdNM3NuZK7ms0jp4X2L1m-H/view?usp=sharing'),
  ('shankarpale-sweet', 'https://drive.google.com/file/d/1o-MNPrABTbyOCBMwpKPxd_9WXODq692l/view?usp=sharing'),
  ('patal-poha-chivda', 'https://drive.google.com/file/d/1jEKNNKQrRPHP9j_xiza0YPJ9dVNldOS_/view?usp=sharing')
) as v(slug, link)
where p.slug = v.slug;
