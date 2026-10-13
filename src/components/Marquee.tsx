type Props = {
  items: string[]
}

export function Marquee({ items }: Props) {
  if (items.length === 0) return null

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((group) => (
          <div className="marquee__group" key={group}>
            {items.map((item, index) => (
              <span className="marquee__item" key={`${group}-${index}`}>
                {item}
                <span className="marquee__dot">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
