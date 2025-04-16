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
    selectedComponent: {
      type: Array as () => IBaseComponent[],
      default: () => [],
    },
  },
  setup(props) {
    if (props.config.type === E_COMPONENT_TYPE.SOURCE) {
      return () => (
        <SourceComponent
          config={props.config as ISourceComponent}
          selectedComponent={props.selectedComponent}
        />
      )
    } else if (props.config.type === E_COMPONENT_TYPE.TRACK) {
      return () => (
        <TrackComponent
          config={props.config as ITrackComponent}
          selectedComponent={props.selectedComponent}
        />
      )
    }
  },
})
</script>
