# Quarto template for a unit at Monash University

This repo provides a quarto template for a Business Analytics unit at Monash University. Please fork or clone this repo to create a new unit website.

It automatically deploys using github pages. So you will need to go to Settings/Pages and set the "Build and deployment" Source to "Github Actions".

For your website to appear on the numbat.space domain (e.g., as abc.numbat.space), you will need to have the CNAME record added to the DNS settings. Please ask Rob Hyndman to do this for you.

# Example units using the template

You can see different variations of the base, particularly breaking content into weeks.

- https://github.com/numbats/af
- https://github.com/numbats/arp
- https://github.com/numbats/crp
- https://github.com/numbats/iml

# A useful addition for making tutorial instructions with solutions

```
quarto install extension ginolhac/unilur
```

Examples of using this to hide or reveal solutions can be seen in `https://github.com/numbats/iml`. And more documentation at https://github.com/MikeLydeamore/unilur
