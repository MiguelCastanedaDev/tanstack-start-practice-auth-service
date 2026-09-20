import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/demo/tanstack-query')({
  component: TanStackQueryDemo,
})

function TanStackQueryDemo() {
  const { data, isFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      await  new Promise((resolve) => setTimeout(resolve, 10000))
      return Promise.resolve([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ])
    },
    initialData: [],
  })

  return (
    <main className="demo-page demo-center">
      <section className="demo-panel w-full max-w-2xl">
        <p className="island-kicker mb-2">TanStack Query</p>
        <h1 className="demo-title mb-6">
          TanStack Query Simple Promise Handling
        </h1>
        {isFetching ? (
          <p className="text-lg text-muted-foreground">
            Cargando datos... (esto simula una llamada a la API que tarda 10 segundos en completarse)
          </p>
        ) : (
          <ul className="mb-4 space-y-2">
            {data.map((todo) => (
              <li key={todo.id} className="demo-list-item">
                <span className="text-base font-medium">{todo.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
