walktober |>
  mutate(
    date = dmy(date),
    day_type = ifelse(wday(date, label = FALSE) %in% c(1, 7), "Weekend", "Weekday")
  ) |>
  group_by(team, day_type) |>
  summarise(avg_steps = mean(steps, na.rm = TRUE), .groups = "drop") |>
  ggplot(aes(x = reorder(team, avg_steps), y = avg_steps, fill = team)) +
  geom_col(show.legend = FALSE) +
  facet_wrap(~day_type) +
  coord_flip() +
  theme_bw() +
  labs(
    title = "Average Daily Steps by Team",
    subtitle = "Weekday vs Weekend",
    y = "Average Step Count",
    x = "Team"
  )
