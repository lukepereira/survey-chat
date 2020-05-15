/*
- Location
- Age (range selection)
- Interests (checkboxes)
- Mood
- Seeking friends, romance, neither/both
- ? Sophistication
- ? myers briggs
*/

export const config = Object.freeze({
  // title: "Social",
  pages: [
    {
      elements: [
        {
          type: "dropdown",
          name: "region",
          title: "Select a region:",
          renderAs: "select2",
          choices: [
            "1|Africa",
            "2|Americas",
            "3|Asia",
            "4|Europe",
            "5|Oceania",
          ],
        },
        {
          type: "dropdown",
          name: "subregion",
          title: "Select a subregion:",
          renderAs: "select2",
          visibleIf: "{region} == '1'",
          choicesByUrl: {
            url: "https://restcountries.eu/rest/v2/region/africa",
          },
        },
        {
          type: "dropdown",
          name: "subregion",
          title: "Select a subregion:",
          renderAs: "select2",
          visibleIf: "{region} == '2'",
          choicesByUrl: {
            url: "https://restcountries.eu/rest/v2/region/americas",
          },
        },
        {
          type: "dropdown",
          name: "subregion",
          title: "Select a subregion:",
          renderAs: "select2",
          visibleIf: "{region} == '3'",
          choicesByUrl: {
            url: "https://restcountries.eu/rest/v2/region/asia",
          },
        },
        {
          type: "dropdown",
          name: "subregion",
          title: "Select a subregion:",
          renderAs: "select2",
          visibleIf: "{region} == '4'",
          choicesByUrl: {
            url: "https://restcountries.eu/rest/v2/region/europe",
          },
        },
        {
          type: "dropdown",
          name: "subregion",
          title: "Select a subregion:",
          renderAs: "select2",
          visibleIf: "{region} == '5'",
          choicesByUrl: {
            url: "https://restcountries.eu/rest/v2/region/oceania",
          },
        },
        {
          type: "checkbox",
          name: "interests",
          title: "Select your interests:",
          // hasSelectAll: true,
          // selectAllText: "Select All Cars",
          choices: [
            "1|Movies",
            "2|Sports",
            "3|Music",
            "4|Literature",
            "5|Tech",
            "6|Politics",
          ],
        },
      ],
    },
  ],
});
