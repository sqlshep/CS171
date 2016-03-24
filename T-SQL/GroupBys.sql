select top 100 * from undata
select countryName, count(*) as Respondents 
from UNdata join Country on (UNdata.country = country.countryid)
group by countryName
order by countryName

select age, count(*) as Respondents 
from UNdata
group by age
order by age 

select countryName, age, count(*) as Respondents 
from UNdata join Country on (UNdata.country = country.countryid)
group by countryName, age
order by countryName, age


select countryName, [100],[101],[102],[103],[104],[105],[106],[107],[108],[109],[110],[111],[112],[113],[114],[115]
from (select country, priority1  from UNdata
		UNION ALL 
		select country,priority2  from UNdata
		UNION ALL 
		select country,priority3  from UNdata
		UNION ALL 
		select country,priority4  from UNdata
		UNION ALL 
		select country,priority5  from UNdata
		UNION ALL 
		select country,priority6  from UNdata
		) p1 join Country on (p1.country = country.countryid)
pivot 
(count(priority1)
for priority1 in ([100],[101],[102],[103],[104],[105],[106],[107],[108],[109],[110],[111],[112],[113],[114],[115])
) as pvt
order by countryName


select countryName,age, [100],[101],[102],[103],[104],[105],[106],[107],[108],[109],[110],[111],[112],[113],[114],[115]
from (select country,age, priority1  from UNdata
		UNION ALL 
		select country,age,priority2  from UNdata
		UNION ALL 
		select country,age,priority3  from UNdata
		UNION ALL 
		select country,age,priority4  from UNdata
		UNION ALL 
		select country,age,priority5  from UNdata
		UNION ALL 
		select country,age,priority6  from UNdata
		) p1 join Country on (p1.country = country.countryid)
pivot 
(count(priority1)
for priority1 in ([100],[101],[102],[103],[104],[105],[106],[107],[108],[109],[110],[111],[112],[113],[114],[115])
) as pvt
order by countryName

select countryName,age,gender,[100],[101],[102],[103],[104],[105],[106],[107],[108],[109],[110],[111],[112],[113],[114],[115]
from (select country,age,gender, priority1  from UNdata
		UNION ALL 
		select country,age,gender,priority2  from UNdata
		UNION ALL 
		select country,age,gender,priority3  from UNdata
		UNION ALL 
		select country,age,gender,priority4  from UNdata
		UNION ALL 
		select country,age,gender,priority5  from UNdata
		UNION ALL 
		select country,age,gender,priority6  from UNdata
		) p1 join Country on (p1.country = country.countryid)
pivot 
(count(priority1)
for priority1 in ([100],[101],[102],[103],[104],[105],[106],[107],[108],[109],[110],[111],[112],[113],[114],[115])
) as pvt
order by countryName

select countryName,education, [100],[101],[102],[103],[104],[105],[106],[107],[108],[109],[110],[111],[112],[113],[114],[115]
from (select country,education, priority1  from UNdata
		UNION ALL 
		select country,education,priority2  from UNdata
		UNION ALL 
		select country,education,priority3  from UNdata
		UNION ALL 
		select country,education,priority4  from UNdata
		UNION ALL 
		select country,education,priority5  from UNdata
		UNION ALL 
		select country,education,priority6  from UNdata
		) p1 join Country on (p1.country = country.countryid)
pivot 
(count(priority1)
for priority1 in ([100],[101],[102],[103],[104],[105],[106],[107],[108],[109],[110],[111],[112],[113],[114],[115])
) as pvt
order by countryName