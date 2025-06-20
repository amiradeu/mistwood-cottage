// Sourced from Infinite World by Bruno Simon
// (https://github.com/brunosimon/infinite-world)

varying vec3 vGameNormal;

#include <fog_pars_vertex>

void main()
{
    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);

    // Sun shade
    vGameNormal = worldNormal;
}