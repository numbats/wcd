## EXAMPLE 1: LETTER SAMPLING

library(ellmer)

## A session is like a chat conversation
session <- chat_anthropic()

question <- "How can I pick a random letter from A-Z."

## send a question to the 'chat'
session$chat(question)

## clarify your request
session$chat("Return R code only")

## inspect all turns in the session so far
session

## EXAMPLE 2: SYSTEM PROMPTS

library(ellmer)

session_tidy_expert <- chat_anthropic(system_prompt = "
  You are an expert R programmer
  who prefers the tidyverse.
  Only return code without explanation.
")

session_tidy_expert$chat(question)

session_tidy_expert

## EXAMPLE 3: AUTHOR NATIONALITIES

text <- "Jane Austen (/ˈɒstɪn, ˈɔːstɪn/ OST-in, AW-stin; 16 December 1775 – 18 July 1817)..."

session_read <- chat_anthropic("You are a data entry assistant.")

nationality_prompt <- "Nationality of person"
session_read$chat_structured(text, type = type_string(description = nationality_prompt))

std_prompt <- "Extract structured data of the nationality of person. Return only ISO 3-digit country code (e.g. GBR, USA)"
session_read$chat_structured(text, type = type_string(description = std_prompt))


## EXAMPLE 4: MULTIPLE AUTHORS

library(dplyr)

author_df <- readr::read_csv('data/author_df_scraped.csv')

short_prompt <- "Nationality of person only"
session_lib <- chat_anthropic(system_prompt = "You are a librarian with expert knowledge of popular authors.")

## let's ask about multiple authors
author_llm = author_df |>
  tail(6) |>
  rowwise() |>
  mutate(nationality_llm = 
           session_lib$clone()$chat_structured(author_name,
                                            type = type_string(short_prompt))
  )

View(author_llm)

## EXAMPLE 5: WCD Instructors

session <- chat_anthropic()
session$chat("List the instructors of Monash University's wild caught data course.")

session <- chat_anthropic()
session$register_tool(claude_tool_web_search())
session$chat("List the instructors of Monash University's wild caught data course.")
