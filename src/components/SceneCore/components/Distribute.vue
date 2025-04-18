<script lang="tsx">
import { defineComponent } from 'vue'
import SourceComponent from '@/components/SceneCore/components/Source.vue'
import TrackComponent from '@/components/SceneCore/components/Track.vue'
import type {
  TComponent,
  IBaseComponent,
  ISourceComponent,
  ITrackComponent,
} from '@/components/SceneCore/types/base'
import { E_COMPONENT_TYPE } from '@/components/SceneCore/enum'
export default defineComponent({
  components: {
    SourceComponent: SourceComponent,
    TrackComponent: TrackComponent,
  },
  props: {
    config: {
      type: Object as () => TComponent,
      required: true,
      default: () => ({}),
    },
    Ref_selectedComponent: {
      type: Object as () => Map<string, TComponent>,
      default: () => new Map<string, TComponent>(),
    },
  },
  setup(props) {
    if (props.config.type === E_COMPONENT_TYPE.SOURCE) {
      return () => (
        <SourceComponent
          config={props.config as ISourceComponent}
          Ref_selectedComponent={props.Ref_selectedComponent}
        />
      )
    } else if (props.config.type === E_COMPONENT_TYPE.TRACK) {
      return () => (
        <TrackComponent
          config={props.config as ITrackComponent}
          Ref_selectedComponent={props.Ref_selectedComponent}
        />
      )
    }
  },
})
</script>
