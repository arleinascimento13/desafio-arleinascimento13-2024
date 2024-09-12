/* REGRAS PARA ENCONTRAR UM RECINTO

    Um lanimaisIncluidos se sente confortável se está num bioma adequado e com
    espaço suficiente para cada indivíduo
    Animais carnívoros devem habitar somente com a própria espécie
    Animais já presentes no recinto devem continuar confortáveis com
    a inclusão do(s) novo(s)
    Hipopótamo(s) só tolera(m) outras espécies estando num recinto
    com savana e rio
    Um macaco não se sente confortável sem outro lanimaisIncluidos no recinto,
    seja da mesma ou outra espécie
    Quando há mais de uma espécie no mesmo recinto, é preciso considerar
    1 espaço extra ocupado
    Não é possível separar os lotes de animais nem trocar os animais que
    já existem de recinto (eles são muito apegados!).
    Por exemplo, se chegar um lote de 12 macacos, não é possível colocar 6 em 2 recintos.

ENTRADAS E SAÍDAS

    O programa deve receber tipo e quantidade de lanimaisIncluidos (nessa ordem)
    O programa deve retornar uma estrutura contendo a lista de todos 
    os recintos viáveis ordenada pelo número do recinto (caso existam)
    e a mensagem de erro (caso exista).

    A lista de recintos viáveis deve indicar o espaço livre que restaria
    após a inclusão do(s) lanimaisIncluidos(is) e o espaço total, no formato:
    "Recinto nro (espaço livre: valorlivre total: valortotal)"
    Caso lanimaisIncluidos informado seja inválido, apresentar erro "lanimaisIncluidos inválido"
    Caso quantidade informada seja inválida, apresentar erro "Quantidade inválida"
    Caso não haja recinto possível, apresentar erro "Não há recinto viável"

    //////////////////////////////////////////////////////////////

número 	bioma 	       tamanho total 	animais existentes
1 	    savana 	       10 	          3 macacos
2 	    floresta 	     5 	            vazio
3 	    savana e rio   7 	            1 gazela
4 	    rio 	         8 	            vazio
5 	    savana 	       9 	            1 leão


O zoológico só está habilitado a tratar dos animais abaixo. A tabela mostra o espaço que cada indivíduo ocupa e em quais biomas se adapta.

espécie 	 tamanho 	bioma
LEAO 	     3 	      savana
LEOPARDO 	 2 	      savana
CROCODILO  3 	      rio
MACACO 	   1 	      savana ou floresta
GAZELA 	   2 	      savana
HIPOPOTAMO 4 	      savana ou rio

*/

class RecintosZoo {
  constructor() {
    // definir recintos existentes e que já contenham animais nos espaços
    // definir características dos animais

    this.recintos = [
      {
        num: 1,
        bioma: "savana",
        espacoLivre: 7,
        total: 10,
        animaisIncluidos: [{ especie: "MACACO", quantidade: 3 }],
      },
      {
        num: 2,
        bioma: "floresta",
        espacoLivre: 5,
        total: 5,
        animaisIncluidos: [],
      },
      {
        num: 3,
        bioma: "savana e rio",
        espacoLivre: 5,
        total: 7,
        animaisIncluidos: [{ especie: "GAZELA", quantidade: 1 }],
      },
      { num: 4, bioma: "rio", espacoLivre: 8, total: 8, animaisIncluidos: [] },
      {
        num: 5,
        bioma: "savana",
        espacoLivre: 6,
        total: 9,
        animaisIncluidos: [{ especie: "LEAO", quantidade: 1 }],
      },
    ];
    this.animaisValidos = {
      LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
      LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
      CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
      MACACO: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
      GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
      HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false },
    };
  }

  analisaRecintos(especie, quantidade) {
    // resposta para o recintos-zoo.test.js

    especie = especie.toUpperCase();

    const infoAnimalSelecionado = this.animaisValidos[especie];
    if (!infoAnimalSelecionado) {
      return { erro: "Animal inválido" };
    }

    if (quantidade <= 0 || typeof quantidade !== "number") {
      return { erro: "Quantidade inválida" };
    }

    // filtra o recinto para o animal
    const recintoValidos = this.recintos.filter((recinto) =>
      infoAnimalSelecionado.biomas.some((bioma) =>
        recinto.bioma.includes(bioma)
      )
    );

    // mostra a quantidade de recintos que o animal pode ir
    const recintosComEspaco = recintoValidos.filter((recinto) => {
      const espacoOcupado = recinto.animaisIncluidos.reduce(
        (espaco, ANIMAL) => {
          const especieANIMAL = this.animaisValidos[ANIMAL.especie];
          return espaco + especieANIMAL.tamanho * ANIMAL.quantidade;
        },
        0
      );

      // regras específicas para convivência
      if (
        infoAnimalSelecionado.carnivoro &&
        recinto.animaisIncluidos.length > 0
      ) {
        return false;
      }

      // hipopótamo só fica com outros animais na savana e rio
      if (
        especie === "HIPOPOTAMO" &&
        recinto.bioma !== "savana e rio" &&
        recinto.animaisIncluidos.length > 0
      ) {
        return false;
      }

      if (
        especie === "MACACO" &&
        recinto.animaisIncluidos.length === 0 &&
        quantidade < 2
      ) {
        // macacos não podem ficar sozinhos
        return false;
      }

      return recinto.espacoLivre >= infoAnimalSelecionado.tamanho * quantidade;
    });

    if (recintosComEspaco.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    // return {
    //   recintosViaveis: recintosComEspaco.map(
    //     (recinto) =>
    //       `Recinto ${recinto.num} (espaço livre: ${
    //         recinto.espacoLivre -
    //         recinto.animaisIncluidos.reduce((espaco, ANIMAL) => {
    //           const infoANIMAL = this.animaisValidos[ANIMAL.especie];
    //           return espaco + infoANIMAL.tamanho * ANIMAL.quantidade;
    //         }, 0)
    //       } total: ${recinto.total})`
    //   ),

    return {
      recintosViaveis: recintosComEspaco.map((recinto) => {
        const espacoOcupado = recinto.animaisIncluidos.reduce(
          (espaco, ANIMAL) => {
            const infoANIMAL = this.animaisValidos[ANIMAL.especie];
            return espaco + infoANIMAL.tamanho * ANIMAL.quantidade;
          },
          0
        );

        return `Recinto ${recinto.num} (espaço livre: ${
          recinto.espacoLivre -
          espacoOcupado -
          infoAnimalSelecionado.tamanho * quantidade
        } total: ${recinto.total})`;
      }),
    };

  }
}

export { RecintosZoo as RecintosZoo };
