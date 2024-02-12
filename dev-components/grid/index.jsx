import React from "react";

import GridBasic from "./GridBasic";
import GridReactive from "./GridReactive";

const GridPage = () => {
  return (
    <div className="dev-grid-page">
      <h1>Grid 栅格布局</h1>
      <ul>
        <li>antd V5中, Grid组件基于flex弹性布局实现。</li>
        <li>
          Grid组件实际上是<b>Row</b>组件和<b>Col</b>
          组件，Row组件包裹Col组件，类似table。
        </li>
        <li>Row组件是一个flex容器(display:flex)，而Col组件是块盒子div。</li>
        <li>
          Grid将父容器宽度分为24等分(栅格数)，通过Col的span属性指定列宽(本质上是设置flex-basis)。
        </li>
        <li>
          对于间隔(gutter)， i.垂直方向，通过设置Row的CSS属性row-gap设置行间距；
          ii.水平方向上，通过容器(Row)的margin和列(Col)的padding设置列间距。
        </li>
        <li>
          对于offset、push或pull，通过CSS属性设置边距(类似magrin、top、left等)实现。
        </li>
      </ul>
      <GridBasic />
      <GridReactive />
    </div>
  );
};

export default GridPage;
