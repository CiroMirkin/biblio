import type { Socio } from "@/models"
import type { KeyboardEvent, SyntheticEvent } from "react"

const ORDER = ["apellidos", "nombres", "dni", "fechaNacimiento", "telefono", "email", "domicilio", "observaciones"]

function focusSiguiente(name: string) {
  const index = ORDER.indexOf(name)
  if (index === -1 || index === ORDER.length - 1) return
  const siguiente = document.getElementById(ORDER[index + 1])
  siguiente?.focus()
}

function handleEnter(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key !== "Enter") return
  e.preventDefault()
  focusSiguiente((e.target as HTMLInputElement).name)
}

export function Inscripcion() {

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const socio: Partial<Socio> = {
      dni: Number(form.dni.value),
      nombreYApellido: `${form.apellidos.value}, ${form.nombres.value}`,
      fechaNacimiento: form.fechaNacimiento.value ? new Date(form.fechaNacimiento.value) : undefined,
      telefono: form.telefono.value,
      domicilio: form.domicilio.value || undefined,
      observaciones: form.observaciones.value || "",
      email: form.email.value || "",
      caracterSocio: "",
    }

    console.log(socio)
  }

  return (
    <>
      <h2 className="pt-4 mb-2 text-xl font-semibold">Inscripción de un nuevo socio</h2>
      
      <div className="w-full grid grid-cols-[3.5fr_1.5fr] gap-4 mt-4">
        <form className="flex flex-col gap-2 card" onSubmit={handleSubmit}>
          <div className="w-full grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-base">
              Apellidos: *
              <input onKeyDown={handleEnter} type="text" name="apellidos" id="apellidos" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Apellidos" required />
            </label>

            <label className="flex flex-col gap-1 text-base">
              Nombres: *
              <input onKeyDown={handleEnter} type="text" name="nombres" id="nombres" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Nombres" required />
            </label>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-base">
              DNI:
              <input onKeyDown={handleEnter} type="text" name="dni" id="dni" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="DNI" />
            </label>

            <label className="flex flex-col gap-1 text-base">
              Fecha de nacimiento:
              <input onKeyDown={handleEnter} type="date" name="fechaNacimiento" id="fechaNacimiento" className="w-full border bg-white border-black rounded p-1 px-2" />
            </label>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-base">
              Numero de celular: *
              <input onKeyDown={handleEnter} type="tel" name="telefono" id="telefono" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Numero de celular" required minLength={10} />
            </label>

            <label className="flex flex-col gap-1 text-base">
              Email:
              <input onKeyDown={handleEnter} type="email" name="email" id="email" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Email" required minLength={10} />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-base">
            Dirección:
            <input onKeyDown={handleEnter} type="text" name="domicilio" id="domicilio" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Dirección" />
          </label>

          <label className="flex flex-col gap-1 text-base">
            Observaciones generales:
            <input onKeyDown={handleEnter} type="text" name="observaciones" id="observaciones" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="" />
          </label>

          <input type="submit" value="Inscribir" className="px-4 py-2 btn mt-2" />
        </form>

        <aside className="sticky top-0 h-fit">
          <section className="p-4 rounded bg-white text-base">
            <p>El apellido, nombre y numero de celular son los únicos datos 100% necesarios.</p>
          </section>
        </aside>
      </div>
    </>
  )
}