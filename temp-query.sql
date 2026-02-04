SELECT pseudo, CASE WHEN avatar IS NOT NULL THEN 'OUI' ELSE 'NON' END as a_avatar FROM public."User";
