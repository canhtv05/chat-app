function RenderIf({ children, value }) {
    return <>{value && children}</>;
}

export default RenderIf;
