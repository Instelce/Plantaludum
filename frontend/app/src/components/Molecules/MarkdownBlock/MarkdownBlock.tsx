import "./MarkdownBlock.scss"
import Markdown from "react-markdown";


function MarkdownBlock({children}: {children: string}) {
  return (
    <div className="md-block">
      <Markdown>{children}</Markdown>
    </div>
  )
}

export default MarkdownBlock;