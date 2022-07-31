
## Luis Tena
#### Venezuela

Toolbox: proyecto de evaluación

Implementé una API y cliente acorde a las especificaciones, donde hay lugar para mejoras debido a la restricción tiempo.

Con respecto al manejo de la clave de acceso al API y además incluirla en este repo, imagino me avisaran al terminar de hacer las pruebas para que yo pueda eliminar este repo y remover esa vulnerabilidad.


Posibles mejoras en API:
- Algunas sugerencias de standard.js que al parecer no tiene sentido, como por ejemplo "eliminar variables de chai que no se usan", aunque son necesarias para el entorno global de chai al ejecutar las pruebas. Posiblemente con más tiempo, pueda dar con una mejor solición para esto.

- Ampliar las pruebas a más casos como los 404 y algunos casos edges.


Posibles mejoras al cliente:
- Usar jest, que por tiempo no pude completar.



#### Los puntos opcionales que pude implementar:
- listdo de archivos con su endpoint independiente. GET files/list

- filtrado de archivos por query. ?fileName=test2.csv

- usar standard.js, aunque como mencionaba antes, faltan algunos warnings por depurar. La verdad nunca habia usado esta herramienta.

- filtrar por nombre de archivo en el cliente react. Para ello agregue un input donde me pareció conveniente a falta de diseño para el mismo.

