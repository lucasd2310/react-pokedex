import { useEffect, useState } from 'react'
import { PokemonCard } from './PokemonCard'
import './PokeList.css'

export function PokeList() {
  const [allPokemon, setAllPokemon] = useState([])

  const cleanName = (name) => {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
    return capitalizedName.replace('-m', '♂').replace('-f', '♀')
  }

  const getAllPokemon = async () => {
    const response = await fetch(
      'https://pokeapi.co/api/v2/pokemon?limit=649&offset=0'
    )
    const data = await response.json()

    function createPokemonObject(results) {
      results.forEach(async (pokemon) => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        )
        const data = await response.json()
        setAllPokemon((currentList) => [...currentList, data])
        allPokemon.sort((a, b) => a.order - b.order)
        //allPokemon.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
        //allPokemon.sort((a, b) => a.id.localeCompare(b.id))
      })
    }

    createPokemonObject(data.results)
  }

  useEffect(() => {
    getAllPokemon()
  }, [])

  return (
    <div className='app-container'>
      <div className='pokemon-container'>
        <div className='all-container'>
          {allPokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              id={pokemon.id.toString().padStart(3, '0')}
              name={cleanName(pokemon.name)}
              image={pokemon.sprites.other['official-artwork'].front_default}
              type={pokemon.types[0].type.name}
              height={pokemon.height}
              weight={pokemon.weight}
              stats={pokemon.stats
                .map((stat) => stat.base_stat)
                .slice(0, 3)}
              statsName={pokemon.stats
                .map((stat) => stat.stat.name)
                .slice(0, 3)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
