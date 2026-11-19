import { test, expect } from "@playwright/test"

type NamedResource = { name: string; url: string }

const baseUrl = "https://pokeapi.co/api/v2/"

test("get favorite pokemon and verify type", async ({ request }) => {
  let favoritePokemonURL: string
  let pokemonFormURL: string

  await test.step("get favorite pokemon", async () => {
    const response = await request.get(`${baseUrl}pokemon?limit=50&offset=0`)
    await expect(response).toBeOK()

    const data: { results: NamedResource[] } = await response.json()
    const url = data.results.find(pokemon => pokemon.name === "pikachu")?.url
    if (!url) throw new Error("Pikachu should be listed with a URL")
    favoritePokemonURL = url
  })

  await test.step("get pokemon form", async () => {
    const response = await request.get(favoritePokemonURL)
    await expect(response).toBeOK()

    const pokemonForm: { forms: NamedResource[] } = await response.json()
    const url = pokemonForm.forms[0]?.url
    if (!url) throw new Error("Pikachu should have at least one form URL")
    pokemonFormURL = url
  })

  await test.step("verify pokemon type", async () => {
    const response = await request.get(pokemonFormURL)
    await expect(response).toBeOK()

    const pokemonForm: { types: { type: NamedResource }[] } = await response.json()
    expect(pokemonForm.types[0]?.type.name).toBe("electric")
  })
})
