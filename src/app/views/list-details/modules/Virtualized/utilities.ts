import { FunctionComponent } from "react"
import { Node } from "./types"
import { uniqueId, capitalize } from "lodash"
import { faker } from "@faker-js/faker"


export const generateFakeData = (count: number, components: FunctionComponent<any>[]): Node[] => {
  const data: Node[] = []
  const [
    GroupComponent,
    HeaderComponent,
    ItemComponent,
    SubitemComponent
  ] = components
  const groups = 5
  const random = Math.floor(Math.random() * (5 - 1 + 1) + 1)
  for (let i = 0; i < groups + random; i++) {
    const list: Node = {
      id: uniqueId().toString(),
      type: GroupComponent,
      collapsed: false,
      data: {
        name: faker.lorem.words(3)
      },
      children: []
    }
    data.push(list)
    const header: Node = {
      id: uniqueId().toString(),
      type: HeaderComponent,
      collapsed: false,
      data: {},
      children: []
    }
    list.children.push(header)

    const random = Math.floor(Math.random() * (25 - 1 + 1) + 1)
    for (let j = 0; j < Math.round(count / groups) + random; j++) {
      const item: Node = {
        id: uniqueId().toString(),
        type: ItemComponent,
        collapsed: false,
        data: {
          "id": faker.string.uuid(),
          "name": `Name ${capitalize(faker.lorem.words(Math.round(random / 2)))}`,
          "details-1": `Details-1 ${capitalize(faker.lorem.words(random))}`,
          "details-2": `Details-2 ${capitalize(faker.lorem.words(random))}`,
          "details-3": `Details-3 ${capitalize(faker.lorem.words(random))}`,
          "due-date": `Due-Date ${faker.date.future().toString()}`,
          "start-date": `Start-Date ${faker.date.past().toString()}`,
          "creator": {
            "first-name": faker.person.firstName(),
            "last-name": faker.person.lastName()
          },
        },
        children: []
      }
      list.children.push(item)
      if (j % 3 === 0) {
        const random = Math.floor(Math.random() * (5 - 1 + 1) + 1)
        for (let k = 0; k < random; k++) {
          const subitem: Node = {
            id: uniqueId().toString(),
            type: SubitemComponent,
            collapsed: true,
            data: {
              "id": faker.string.uuid(),
              "name": `Name ${capitalize(faker.lorem.words(Math.round(random / 2)))}`,
              "details-1": `Details-1 ${capitalize(faker.lorem.words(random))}`,
              "details-2": `Details-2 ${capitalize(faker.lorem.words(random))}`,
              "details-3": `Details-3 ${capitalize(faker.lorem.words(random))}`,
              "due-date": `Due-Date ${faker.date.future().toString()}`,
              "start-date": `Start-Date ${faker.date.past().toString()}`,
              "creator": {
                "first-name": faker.person.firstName(),
                "last-name": faker.person.lastName()
              }
            },
            children: []
          }
          item.children.push(subitem)
        }
      }
    }
  }
  return data
}