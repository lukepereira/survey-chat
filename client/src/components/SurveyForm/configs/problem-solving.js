/*
- Location (Dropdown)
- Fields of Study or Research (Dropdown)
- Seeking Specialist in (Checkboxes)
- Expertise (slider or range)
- ? Problem space (alphanumeric/regex filter)
- global issues https://en.wikipedia.org/wiki/List_of_global_issues#Global_catastrophic_risks
*/

export const config = Object.freeze({
  // title: "Problem Solving",
  pages: [
    {
      elements: [
        {
          type: "tagbox",
          name: "global-issues",
          title: "Select global issues of interest:",
          renderAs: "select2",
          choices: [
            "Artificial general intelligence",
            "Climate change",
            "Global pandemic",
            "Governance",
            "Nuclear holocaust",
            "Overpopulation",
            "Sustainability and Energy",
            "Terrorism",
          ],
        },
        {
          type: "dropdown",
          name: "field-of-study",
          title: "Select a field of study:",
          renderAs: "select2",
          choices: [
            "1|Formal sciences",
            "2|Humanities and social science",
            "3|Natural sciences",
            "4|Professions and applied sciences",
          ],
        },
        {
          type: "tagbox",
          name: "formal-sciences-subfield",
          visibleIf: "{field-of-study} == '1' ",
          title: "Select a subfield:",
          renderAs: "select2",
          choices: [
            "1|Computer sciences",
            "2|Logic",
            "3|Mathematics",
            "4|Systems science",
          ],
        },
        {
          type: "tagbox",
          name: "humanities-subfield",
          visibleIf: "{field-of-study} == '2' ",
          title: "Select a subfield:",
          renderAs: "select2",
          choices: [
            "1|Anthropology",
            "2|History",
            "3|Linguistics",
            "4|Philosophy",
            "5|Religion",
            "6|The arts",
            "7|Economics",
            "8|Geography",
            "9|Interdisciplinary studies",
            "10|Political science",
            "11|Psychology",
            "12|Sociology",
          ],
        },
        {
          type: "tagbox",
          name: "natural-sciences-subfield",
          visibleIf: "{field-of-study} == '3' ",
          title: "Select a subfield:",
          renderAs: "select2",
          choices: [
            "1|Biology",
            "2|Chemistry",
            "3|Earth sciences",
            "4|Physics",
            "5|Space sciences",
          ],
        },
        {
          type: "tagbox",
          name: "applied-sciences-subfield",
          visibleIf: "{field-of-study} == '4' ",
          title: "Select a subfield:",
          renderAs: "select2",
          choices: [
            "1|Agriculture",
            "2|Architecture and design",
            "3|Business",
            "4|Divinity",
            "5|Education",
            "6|Engineering and technology",
            "7|Environmental studies and forestry",
            "8|Family and consumer science",
            "9|Human physical performance and recreation",
            "10|Journalism, media studies and communication",
            "11|Law",
            "12|Library and museum studies",
            "13|Medicine",
            "14|Military sciences",
            "15|Public administration",
            "16|Social work",
            "17|Transportation",
          ],
        },
      ],
    },
  ],
});
