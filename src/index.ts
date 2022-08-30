import { Engine } from './core'
import { Renderer } from './core/Renderer'
import { FMath, Vector } from './math'
import { RigidBody } from './physics'
import { Material } from './physics/Material'
import { Shapes } from './physics/Shapes'
import { World } from './physics/World'
import { Color } from './util/Color'
import { Random } from './util/Random'

const ENGINE = new Engine({ tickRate: 120, renderer: { width: 0, height: 0 } })
const WORLD = new World
const RENDERER = new Renderer(innerWidth, innerHeight)

document.getElementById('main')?.append(RENDERER.canvas)

RENDERER.canvas.style.backgroundColor = Color.BLACK.toString()

let { min, max } = RENDERER.camera.bounds
let padding = Vector.multiply(.1, Vector.subtract(max, min))

let ground = Shapes.rectangle({
    position: new Vector(0, max.y - padding.y),
    material: Material.ROCK, width: max.x - min.x - padding.x, height: 3, isStatic: true,
    rendering: { fillColor: Color.GREEN, visible: true }
})

WORLD.addBody(ground)

for (let i = 0; i < 20; i++) {
    let x = Random.float(min.x + padding.x * 2, max.x - padding.x * 2)
    let y = Random.float(min.y + padding.y, -padding.y * 2)
    let orientation = Random.float(0, FMath.TWO_PI)
    let material = Material.METAL

    let body: RigidBody

    if (Random.boolean()) {
        let radius = Random.float(1.2, 1.8)

        body = Shapes.circle({
            position: new Vector(x, y), orientation,
            material, radius
        })
    } else if (Random.boolean()) {
        let radius = Random.float(1.2, 1.8)
        let sides = Random.integer(3, 8)

        body = Shapes.polygon({
            position: new Vector(x, y), orientation,
            material, radius, sides
        })
    } else {
        let width = Random.float(1.8, 3.6)
        let height = Random.float(1.8, 3.6)

        body = Shapes.rectangle({
            position: new Vector(x, y), orientation,
            material, width, height
        })
    }

    WORLD.addBody(body)
}

let fps = 0

ENGINE.on('update', (delta) => {
    WORLD.update(delta)

    let total = 0

    for (let d of ENGINE.timestep.deltaHistory) total += d

    fps = ENGINE.timestep.deltaHistory.length / total
}).on('render', () => {
    RENDERER.render(WORLD)
})

console.log(ENGINE)

export {}