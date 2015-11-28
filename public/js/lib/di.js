var memory = {
    components: null
};

export default function setComponents(components) {
    memory.components = components;
}

export function getComponent(component) {
    return memory.components[component];
}