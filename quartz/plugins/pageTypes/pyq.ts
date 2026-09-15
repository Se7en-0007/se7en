import { QuartzPageTypePlugin } from "../types"
import { PyqSearch } from "../../components/PyqSearch"

export const PyqPage: QuartzPageTypePlugin = () => ({
  name: "PyqPage",
  priority: 100,
  match: () => false,
  generate: () => [
    {
      slug: "pyqs",
      title: "PYQs",
      data: {
        description: "Search Prelims and Mains previous year questions by topic, paper and year.",
      },
    },
  ],
  layout: "pyq",
  body: () => PyqSearch,
})
