/* REGRAS PARA ENCONTRAR UM RECINTO

    Um animal se sente confortável se está num bioma adequado e com
    espaço suficiente para cada indivíduo
    Animais carnívoros devem habitar somente com a própria espécie
    Animais já presentes no recinto devem continuar confortáveis com
    a inclusão do(s) novo(s)
    Hipopótamo(s) só tolera(m) outras espécies estando num recinto
    com savana e rio
    Um macaco não se sente confortável sem outro animal no recinto,
    seja da mesma ou outra espécie
    Quando há mais de uma espécie no mesmo recinto, é preciso considerar
    1 espaço extra ocupado
    Não é possível separar os lotes de animais nem trocar os animais que
    já existem de recinto (eles são muito apegados!).
    Por exemplo, se chegar um lote de 12 macacos, não é possível colocar 6 em 2 recintos.

ENTRADAS E SAÍDAS

    O programa deve receber tipo e quantidade de animal (nessa ordem)
    O programa deve retornar uma estrutura contendo a lista de todos 
    os recintos viáveis ordenada pelo número do recinto (caso existam)
    e a mensagem de erro (caso exista).

    A lista de recintos viáveis deve indicar o espaço livre que restaria
    após a inclusão do(s) animal(is) e o espaço total, no formato:
    "Recinto nro (espaço livre: valorlivre total: valortotal)"
    Caso animal informado seja inválido, apresentar erro "Animal inválido"
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
    //definir caracteristicas dos animais

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
    //resposta pra o recintos-zoo.test.js

    especie = especie.toUpperCase();

    const infoAnimalSelecionado = this.animaisValidos[especie];
    if (!infoAnimalSelecionado) {
      return { erro: "Animal inváldido." };
    }

    if (quantidade <= 0 || typeof quantidade != "number") {
      return { erro: "Quantidade inváldida." };
    }

    // filtra o recinto pra o animal
    const recintoValidos = this.recintos.filter((recinto) =>
      infoAnimalSelecionado.biomas.includes(recinto.bioma)
    );

    // mostra a quantidade de recintos que o animal pode ir
    const recintosComEspaco = this.recintos.filter((recinto) => {
      const recintoOcupado = this.recintos.reduce((espaco, animal) => {
        const especieAnimal = this.animaisValidos[animal.especie];
        return espaco + especieAnimal.tamanho * animal.quantidade;
      }, 0);
      if (!recintosComEspaco) {
        return { erro: "Quantidade de recintos inválida." };
      }

      // regras específicas para convivência

      if (infoAnimalSelecionado.carnivoro) {
        if (
          recinto.animal.length > 0 &&
          recinto.animal[0].especie !== especie
        ) {
          return false;
        }
      }

      // hipo so fica com outros animais na savana e rio
      if (especie === "HIPOPOTAMO") {
        if (recinto.bioma !== "savana e rio" && recinto.animal.length > 0) {
          return false;
        }
      }

      if (
        especie === "MACACO" &&
        recinto.animais.length === 0 &&
        quantidade < 2
      ) {
        // macacos nao pode ficar so
        return false;
      }

      if (recinto.animais.length > 0 && recinto.animais[0].espaco != especie) {
        espacoJaOcupado += 1;
      }

      return (
        recinto.total - espacoJaOcupado >=
        (infoAnimalSelecionado.tamanho = quantidade)
      );
    });

    

    return;
  }
}

const x = new RecintosZoo();

// ambiente de teste

console.log(x.analisaRecintos("MACACO", 1)); // funcional
console.log(x.analisaRecintos("ANIMAL ERRADO", 1)); // caso animal esteja errado
console.log(x.analisaRecintos("MACACO", "NUMERO ERRADO")); // caso quantidade esteja errado

// export { RecintosZoo as RecintosZoo };
