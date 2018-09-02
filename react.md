react 组件优化：
1. 如果组件是Component类型并且组件没有写shouldComponentUpdate生命周期函数，不管组件的props是否改变组件一定更新。而组件类型为PureComponent时，当组件的props和state不变时，组件是不更新的。因此只要用PureComponent替换掉项目中所有Component就会使你的项目性能提升很多。
2. 纯函数组件在内部被包装成了一个只有render方法的StatelessComponent组件，在所有情况下都会更新
3. 别在render函数中进行大量计算， 利用生命周期
4. props的传递  <Person { ...this.props } />  避免使用这种写法，要这么写，一定要剔除多余参数
5. 不要在组件上写对象 <TestComponent style={{color:"#f00" }} />  这样每次更新时，都会产生新的内存地址，react浅比较就会更新
6. 不在react组件上运用bind， () => {}等方式  <ListItem key={item.id} onClick={this.handleClick.bind(this, item.id)} />，采用提前bind方式来解决， 在dom上可以直接使用
7. key值不要使用数组的下标  { list.map((item, index) => <ListItem key={index} > ......</ListItem>) }， 这样数组的顺序改变或者长度改变，就会造成根据新的子元素的key值不能找到正确的对应组件实例。结果是大量的不必要更新，如果子组件类型不同时，还会造成大量的组件卸载和挂载。如果列表很长， 可以使用react-virtualized库来做