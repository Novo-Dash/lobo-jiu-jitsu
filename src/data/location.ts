import type { Title } from '../types'
import { img } from './img'

export const LOCATION = {
  title: { a: 'Find us ', b: 'in Aurora' } satisfies Title,
  lead: 'Serving Aurora and nearby communities, including Naperville.',
  mapTitle: 'Map: Lobo Jiu-Jitsu, 646 S Frontenac St, Suite 109, Aurora, IL',
  card: { name: 'Lobo Jiu-Jitsu', line1: '646 S Frontenac St, Suite 109', line2: 'Aurora, Illinois 60504', directions: 'Get directions', call: 'Call' },
  street: 'S FRONTENAC ST',
  park: 'PARK',
  // [CONFIRMAR versão maior da fachada]
  storefront: img('storefront', 'The Lobo Jiu-Jitsu storefront, a brick building with the wolf logo above the door'),
  storeNote: 'In a commercial center, with a park nearby',
  contacts: { callOrText: 'Call or text' }, // [CONFIRMAR: o telefone aceita SMS?]
}
