import { styled } from "..";

export const HomeContainer = styled("main", {
  display: "flex",
  // gap: "3rem",
  maxWidth: "calc(100vw - ((100vw - 1200px) / 2))",
  marginLeft: "auto",
  minHeight: 600,
});

export const Product = styled("div", {
  background: "linear-gradient(180deg, #1ea483 0%, #7465d4 100%)",
  borderRadius: "0.5rem",
  // padding: "0.25rem",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden", // conteúdo que ultrapassa o tamanho do elemento é escondido (efeito do preço com hoover)

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  img: {
    objectFit: "cover",
  },

  footer: {
    position: "absolute", // para ficar por cima da imagem
    bottom: "0.25rem",
    left: "0.25rem",
    right: "0.25rem",
    padding: "2rem",

    borderRadius: "0.25rem",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "rgba(0, 0, 0, 0.6)",


    transform: "translateY(110%)",      // para ficar escondido
    opacity: 0,                         // para ficar invisível
    transition: "all 0.2s ease-in-out", // para fazer a transição de esconder para aparecer

    strong: {
      color: "$gray100",
      fontSize: "$lg",
    },

    span: {
      fontSize: "$xl",
      fontWeight: "bold",
      color: "$green300",
    }
  },

  "&:hover": {
    footer: {
      transform: "translateY(0%)", // para aparecer
      opacity: 1,                  // para ficar visível
    }
  }

})