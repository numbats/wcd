library(tidyverse)
library(lubridate)
library(randomNames)
library(dplyr)

# ---- Create synthetic data ----

# Determine the sample size
n <- 40

# create an empty data frame with 40 rows
tute09_dat <- data.frame(matrix(nrow = n))

# create dummy data with binary variable of gender
set.seed(1)
tute09_dat$sex <- ifelse(sign(rnorm(n)) == -1, "M", "F")

# create numeric data for age
tute09_dat$age <- sample(19:78, n, replace = TRUE)

# create fake date
tute09_dat$date_time <-sample(seq(ymd_hms("2022-2-11 9:00:00", tz ="Australia/Melbourne"), ymd_hms("2022-2-11 21:00:00", tz ="Australia/Melbourne"), by="min"), n)

# change the datetime to to date format
tute09_dat$date <- date(tute09_dat$date_time)

# create a column of blood collection time
tute09_dat$time <- ifelse(hour(tute09_dat$date_time)<12, "morning",
                          ifelse(hour(tute09_dat$date_time)<17,"afternoon",
                                 "evening"))

# create blood sugar category
tute09_dat$blood_sugar <- sample(c("high","normal"), n, replace = TRUE)

# create fake name
tute09_dat$firstname = randomNames(40, which.names = "first")
tute09_dat$lastname = randomNames(40, which.names = "last")

# final data
survey_data <- tute09_dat %>%
  dplyr::select(time,blood_sugar,sex,age,date)

blood_donation <- tute09_dat %>%
  dplyr::select(date_time,sex,age,firstname,lastname)

write.csv(blood_donation,"data/blood_donation.csv", row.names=FALSE)
write.csv(survey_data,"data/survey_data.csv", row.names=FALSE)
