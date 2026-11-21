export default function TitleTiles({ word }: { word: string }) {
  return (
    <div className="title-tiles" aria-hidden="true">
      {[...word].map((letter, i) => (
        <span className="title-tile" key={i}>
          {letter}
          <small>{letter === "M" ? 3 : letter === "V" ? 4 : 1}</small>
        </span>
      ))}
    </div>
  )
}
