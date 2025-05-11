# Webscrape the nationalities

library(tidyverse)
library(rvest)

# -----------------------------------------------------------------------------

# Get the nationalitites from the UK Government website

nationalities_url = "https://www.gov.uk/government/publications/nationalities/list-of-nationalities"

nationalities_data = read_html(nationalities_url) |>
  html_elements("td") |>
  html_text(trim = TRUE)

not_empty = (nationalities_data != "")
nationalities_data = nationalities_data[not_empty]

# -----------------------------------------------------------------------------

Get_url_for_author <- function(author_name, scraped_table){

  search_str = paste0("a[title = '", author_name, "']")

  matching_link = tryCatch(
    scraped_table |>
      html_elements(search_str) |>
      html_attr("href"),
    error = function(e) { NA })

  return(matching_link)

}

Get_url_from_html_table <- function(scraped_table){

  if(is.list(scraped_table)) scraped_table = scraped_table |> pluck(1)

  # get the html table entries
  table_entries = scraped_table |>
    html_elements("td")

  # make the table a data frame in R
  table_df = scraped_table |>
    html_table()
  author_vec = table_df$`Author(s)`

  # get the table dimensions
  table_dim = table_df |>
    dim()
  nrows = table_dim[1]
  ncols = table_dim[2]

  # the authors are in the second row, so get the cell indexes
  cell_indexes = seq(2, nrows*ncols, by = ncols)
  if(nrows*ncols == length(table_entries)){

    author_links = table_entries[cell_indexes] |>
      html_element("a") |>
      html_attr("href")

  }else{

  # however, some tables aren't standard for
  # for this we need a different function
  author_links = sapply(author_vec, Get_url_for_author, scraped_table)

  }

  author_links = paste0("https://en.wikipedia.org", author_links)
  author_df = data.frame(author_name = author_vec, author_links)

  return(author_df)

}

bestsellers_url <- "https://en.wikipedia.org/wiki/List_of_best-selling_books"
wiki_bestseller_tables = read_html(bestsellers_url) |>
  html_elements("table.wikitable")

warning("Hard code to avoid unwanted tables - don't want the dictionary!")
wiki_bestseller_tables_relevant = wiki_bestseller_tables[1:9]

author_df = NULL
for(i in 1:length(wiki_bestseller_tables_relevant)){
  result = Get_url_from_html_table(wiki_bestseller_tables_relevant[i])
  author_df = bind_rows(author_df, result)
}

# -----------------------------------------------------------------------------

Read_wiki_page <- function(author_url){
  wiki_data <- read_html(author_url)
  return(wiki_data)
}

Get_wiki_infocard <- function(wiki_data){
  infocard <- wiki_data |>
    html_element(".infobox.vcard") |>
    html_table(header = FALSE)
  return(infocard)
}

Get_nationality_from_infocard <- function(infocard){
  nationality <- infocard |>
    rename(Category = X1, Response = X2) |>
    filter(Category == "Nationality") |>
    pull(Response)
  return(nationality)
}

Get_first_text <- function(wiki_data){

  paragraph_data <- wiki_data |>
    html_elements("p")

  i = 1
  no_text = TRUE
  while(no_text){

    text_data <- paragraph_data |>
      purrr::pluck(i) |>
      html_text()

    check_text = gsub("\\s+", "", text_data)

    if(check_text == ""){
      # keep searching
      i = i + 1
    }else{
      # end the while loop
      no_text = FALSE
    }
  }
  return(text_data)
}

Guess_nationality_from_text <- function(text_data, possible_nationalities){

  num_matches <- str_count(text_data, possible_nationalities)

  prob_matches <- num_matches/sum(num_matches)

  i = which(prob_matches > 0)
  if(length(i) == 1){

    prob_nationality = possible_nationalities[i]

    return(prob_nationality)

  }else if(length(i) > 0){

    warning(paste(c("More than one match for the nationality:",
                    possible_nationalities[i], "\n"), collapse = " "))

    likely_nationality = which.max(prob_matches)

    prob_nationality = possible_nationalities[likely_nationality]

    return(prob_nationality)

  }else{

    return("No nationality matched")

  }

}

Query_nationality_from_wiki <- function(author_url, possible_nationalities){

  wiki_data <- Read_wiki_page(author_url)

  infocard <- Get_wiki_infocard(wiki_data)

  if(is.null(infocard)){

    first_paragraph <- Get_first_text(wiki_data)

    nationality <- Guess_nationality_from_text(first_paragraph,
                                               possible_nationalities)

    return(nationality)

  }

  if(any(infocard[,1] == "Nationality")){

    # info card exists and has nationality
    nationality <- Get_nationality_from_infocard(infocard)

  }else{

    # no nationality in infocard - find nationality in text
    text_data <- Get_first_text(wiki_data)
    nationality <- Guess_nationality_from_text(text_data,
                                               possible_nationalities)

  }

  return(nationality)

}

Wrapper_nationality_query <- function(author_url, possible_nationalities){

  author_nationality = tryCatch(
    Query_nationality_from_wiki(author_url, possible_nationalities),
    error = function(e){print("Encountered an error; returning an error code 99999"); return(99999)})

  return(author_nationality)
}

# -----------------------------------------------------------------------------

author_df = author_df |> mutate(nationality = NA)
for(i in 1:nrow(author_df)){

  author_url = author_df$author_links[i]
  author_df$nationality[i] = Wrapper_nationality_query(author_url = author_url,
                            possible_nationalities = nationalities_data)
  print(paste(i, author_df$author_name[i], author_df$nationality[i]))

}

write_csv(author_df, "data/author_df.csv")

# ------------------------------------------------------------------------------

