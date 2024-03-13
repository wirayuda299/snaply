export const getPostStats = (
  likes: number,
  totalComments: number,
  totalShare: number,
) => {
  return [
    {
      icon: "/assets/general/icons/heart.svg",
      alt: "hearth icon",
      value: likes,
      label: "Hearts",
    },
    {
      icon: "/assets/general/icons/chat.svg",
      alt: "chat icon",
      value: totalComments,
      label: "Comments",
    },
    {
      icon: "/assets/groups/icons/share.svg",
      alt: "share icon",
      value: totalShare,
      label: "Share",
    },
  ];
};
